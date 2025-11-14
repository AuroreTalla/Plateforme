package com.example.plateformeback.jwt;

import com.example.plateformeback.user.Users;
import com.example.plateformeback.user.UsersService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

import static org.apache.commons.codec.digest.DigestUtils.sha256Hex;

@Slf4j
@AllArgsConstructor
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final UsersService usersService;
    private final JwtService jwtService;
    private final JwtCookieService jwtCookieService;
    private final JwtRepository jwtRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = jwtCookieService.getTokenFromCookies(request, JwtService.BEARER);
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String email = jwtService.extractUsername(token);
            Users user = usersService.getUserByEmail(email);

            String hashedToken = sha256Hex(token);
            Optional<Jwt> jwtOpt = jwtRepository.findByValeurAndDesactiveAndExpire(hashedToken, false, false);

            if (jwtOpt.isEmpty()) {
                log.warn("Token révoqué ou invalide pour {}", email);
                filterChain.doFilter(request, response);
                return;
            }

            if (jwtService.validateToken(token, user)) {
                authenticateUser(user);
            } else if (jwtService.isTokenExpired(token)) {
                refreshJwtIfPossible(request, response, user);
            }

        } catch (Exception e) {
            log.warn("Erreur JWT: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private void authenticateUser(Users user) {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
    }

    private void refreshJwtIfPossible(HttpServletRequest request, HttpServletResponse response, Users user) {
        Optional<String> refreshTokenOpt = jwtCookieService.getOptionalTokenFromCookies(request, JwtService.REFRESH);
        refreshTokenOpt.ifPresent(refreshToken -> {
            try {
                Map<String, String> tokens = jwtService.refreshTokens(refreshToken);
                jwtCookieService.addTokenCookies(response, tokens);
                authenticateUser(user);
                log.info("JWT renouvelé automatiquement pour {}", user.getEmail());
            } catch (RuntimeException e) {
                log.warn("Échec du rafraîchissement du token pour {}", user.getEmail());
            }
        });
    }
}