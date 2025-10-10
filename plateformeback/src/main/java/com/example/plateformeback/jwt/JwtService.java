package com.example.plateformeback.jwt;

import com.example.plateformeback.user.Users;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Slf4j
@Service
public class JwtService {

    public static final String BEARER = "jwt";
    public static final String REFRESH = "refresh";

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration.access}")
    private long jwtExpirationMs;

    @Value("${jwt.expiration.refresh}")
    private long refreshExpirationMs;

    // -------------------------------
    // 🔹 Génération des tokens
    // -------------------------------
    public Map<String, String> generateTokens(Users user) {
        Map<String, String> tokens = new HashMap<>();
        tokens.put(BEARER, buildToken(new HashMap<>(), user, jwtExpirationMs));
        tokens.put(REFRESH, buildToken(new HashMap<>(), user, refreshExpirationMs));
        return tokens;
    }

    public Map<String, String> refreshTokens(String refreshToken) {
        String username = extractUsername(refreshToken);
        if (isTokenExpired(refreshToken)) {
            throw new RuntimeException("Refresh token expiré");
        }

        Users user = new Users();
        user.setEmail(username);
        return generateTokens(user);
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

    // -------------------------------
    // 🔹 Validation et expiration
    // -------------------------------
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

    // -------------------------------
    // 🔹 Déconnexion
    // -------------------------------
    public void deconnexion(Users user) {
        log.info("Utilisateur {} déconnecté", user.getEmail());
    }
}
