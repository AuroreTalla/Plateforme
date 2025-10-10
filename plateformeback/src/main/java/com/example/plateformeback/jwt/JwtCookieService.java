package com.example.plateformeback.jwt;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

@Service
public class JwtCookieService {

    public String getTokenFromCookies(HttpServletRequest request, String name) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> name.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    public Optional<String> getOptionalTokenFromCookies(HttpServletRequest request, String name) {
        return Optional.ofNullable(getTokenFromCookies(request, name));
    }

    /**
     * Ajoute deux cookies : le JWT d'accès (30 min) et le refresh token (7 jours)
     */
    public void addTokenCookies(HttpServletResponse response, Map<String, String> tokens) {
        addCookie(response, JwtService.BEARER, tokens.get(JwtService.BEARER), 30 * 60); // 30 min
        addCookie(response, JwtService.REFRESH, tokens.get(JwtService.REFRESH), 7 * 24 * 60 * 60); // 7 jours
    }

    /**
     * Ajoute un cookie HTTPOnly, compatible cross-origin
     */
    private void addCookie(HttpServletResponse response, String name, String value, int maxAgeSeconds) {
        Cookie cookie = new Cookie(name, value != null ? value : "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // ⚠️ à passer à true en production (https)
        cookie.setPath("/");
        cookie.setMaxAge(maxAgeSeconds);

        // ✅ Compatibilité CORS complète
        cookie.setAttribute("SameSite", "None");

        response.addCookie(cookie);
    }

    /**
     * Supprime les cookies JWT et Refresh
     */
    public void clearTokens(HttpServletResponse response) {
        addCookie(response, JwtService.BEARER, "", 0);
        addCookie(response, JwtService.REFRESH, "", 0);
    }
}
