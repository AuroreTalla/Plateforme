package com.example.plateformeback.jwt;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

@Service
public class JwtCookieService {

    @Value("${app.cookie.secure:false}")
    private boolean cookieSecure;

    @Value("${app.cookie.samesite:Lax}")
    private String cookieSameSite;

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

    public void addTokenCookies(HttpServletResponse response, Map<String, String> tokens) {
        addCookie(response, JwtService.BEARER, tokens.get(JwtService.BEARER), 30 * 60);
        addCookie(response, JwtService.REFRESH, tokens.get(JwtService.REFRESH), 7 * 24 * 60 * 60);
    }

    private void addCookie(HttpServletResponse response, String name, String value, int maxAgeSeconds) {
        Cookie cookie = new Cookie(name, value != null ? value : "");
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/");
        cookie.setMaxAge(maxAgeSeconds);
        cookie.setAttribute("SameSite", cookieSameSite);
        response.addCookie(cookie);
    }

    public void clearTokens(HttpServletResponse response) {
        addCookie(response, JwtService.BEARER, "", 0);
        addCookie(response, JwtService.REFRESH, "", 0);
    }
}