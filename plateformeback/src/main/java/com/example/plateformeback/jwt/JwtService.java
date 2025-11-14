package com.example.plateformeback.jwt;

import com.example.plateformeback.user.Users;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static org.apache.commons.codec.digest.DigestUtils.sha256Hex;

@Slf4j
@Service
public class JwtService {

    private final JwtRepository jwtRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    public static final String BEARER = "Bearer";
    public static final String REFRESH = "refresh";

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration.access}")
    private long jwtExpirationMs;

    @Value("${jwt.expiration.refresh}")
    private long refreshExpirationMs;

    // ✅ Constructeur manuel (sans injection des @Value)
    public JwtService(JwtRepository jwtRepository, RefreshTokenRepository refreshTokenRepository) {
        this.jwtRepository = jwtRepository;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Transactional
    public Map<String, String> generateTokens(Users user) {
        String accessTokenStr = buildToken(new HashMap<>(), user, jwtExpirationMs);
        String refreshTokenStr = buildToken(new HashMap<>(), user, refreshExpirationMs);

        // ✅ Hasher AVANT de sauvegarder
        RefreshToken refreshToken = RefreshToken.builder()
                .valeur(sha256Hex(refreshTokenStr))  // ✅ Hash manuellement
                .users(user)
                .creation(Instant.now())
                .expiration(Instant.now().plusMillis(refreshExpirationMs))
                .expire(false)
                .build();
        refreshToken = refreshTokenRepository.save(refreshToken);

        Jwt jwt = Jwt.builder()
                .valeur(sha256Hex(accessTokenStr))  // ✅ Hash manuellement
                .users(user)
                .refreshToken(refreshToken)
                .dateExpiration(Instant.now().plusMillis(jwtExpirationMs))
                .desactive(false)
                .expire(false)
                .build();
        jwtRepository.save(jwt);

        Map<String, String> tokens = new HashMap<>();
        tokens.put(BEARER, accessTokenStr);  // ✅ Retourne en clair
        tokens.put(REFRESH, refreshTokenStr);
        return tokens;
    }

    @Transactional
    public Map<String, String> refreshTokens(String refreshTokenStr) {
        String username = extractUsername(refreshTokenStr);

        if (isTokenExpired(refreshTokenStr)) {
            throw new RuntimeException("Refresh token expiré");
        }

        String hashedRefresh = sha256Hex(refreshTokenStr);
        RefreshToken refreshToken = refreshTokenRepository.findByValeur(hashedRefresh)
                .orElseThrow(() -> new RuntimeException("Refresh token invalide"));

        if (!refreshToken.isActive()) {
            throw new RuntimeException("Refresh token expiré ou révoqué");
        }

        jwtRepository.findByRefreshTokenValeur(hashedRefresh)
                .ifPresent(oldJwt -> {
                    oldJwt.setDesactive(true);
                    oldJwt.setExpire(true);
                    jwtRepository.save(oldJwt);
                });

        Users user = refreshToken.getUsers();
        String newAccessToken = buildToken(new HashMap<>(), user, jwtExpirationMs);

        Jwt newJwt = Jwt.builder()
                .valeur(sha256Hex(newAccessToken))  // ✅ Hash manuellement
                .users(user)
                .refreshToken(refreshToken)
                .dateExpiration(Instant.now().plusMillis(jwtExpirationMs))
                .desactive(false)
                .expire(false)
                .build();
        jwtRepository.save(newJwt);

        Map<String, String> tokens = new HashMap<>();
        tokens.put(BEARER, newAccessToken);
        tokens.put(REFRESH, refreshTokenStr);
        return tokens;
    }

    private String buildToken(Map<String, Object> extraClaims, Users user, long expiration) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public boolean validateToken(String token, Users user) {
        try {
            final String username = extractUsername(token);
            return username.equals(user.getEmail()) && !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Token JWT invalide : {}", e.getMessage());
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        }
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extractAllClaims(token));
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    @Transactional
    public void deconnexion(Users user) {
        jwtRepository.findByUsersEmail(user.getEmail()).forEach(jwt -> {
            jwt.setDesactive(true);
            jwt.setExpire(true);
            jwtRepository.save(jwt);
        });
        log.info("Utilisateur {} déconnecté", user.getEmail());
    }
}
