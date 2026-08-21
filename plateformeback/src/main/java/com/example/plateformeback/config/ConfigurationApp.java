package com.example.plateformeback.config;

import com.example.plateformeback.jwt.JwtFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableWebSecurity
public class ConfigurationApp {

    private final AuthentificationConfig authentificationConfig;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JwtFilter jwtFilter;
    private final UserDetailsService userDetailsService;

    // ✅ AJOUT: Récupération de l'URL du frontend depuis application.properties
    @Value("${app.frontend.url:http://localhost}")
    private String frontendUrl;

    public ConfigurationApp(BCryptPasswordEncoder bCryptPasswordEncoder,
                            JwtFilter jwtFilter,
                            UserDetailsService userDetailsService,
                            AuthentificationConfig authentificationConfig) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtFilter = jwtFilter;
        this.userDetailsService = userDetailsService;
        this.authentificationConfig = authentificationConfig;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
<<<<<<< HEAD
                        // Endpoints publics
                        .requestMatchers("/users/**").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/app/**").permitAll()
                        
                        // ✅ AJOUT: Healthcheck pour Docker
                        .requestMatchers("/actuator/**").permitAll()
                        
                        // Endpoints protégés
                        .requestMatchers("/groupes/**").authenticated()
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        
                        // Tout le reste nécessite une authentification
                        .anyRequest().authenticated()
=======
                .requestMatchers(
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/api-docs/**",
                        "/v3/api-docs/**"
                ).permitAll()
                .requestMatchers("/users/**").permitAll()
                .requestMatchers("/users/mot-de-passe-oublie", "/users/reinitialiser-mot-de-passe").permitAll()
                .requestMatchers("/groupes/**").authenticated()
                .requestMatchers("/reponses/**").permitAll()
                .requestMatchers("/publications/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/ws/**").permitAll()
                .requestMatchers("/app/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .anyRequest().authenticated()
>>>>>>> origin/main
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(this.jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ✅ AMÉLIORATION: Liste dynamique incluant l'URL de production
        List<String> allowedOrigins = new ArrayList<>();
        
        // URL de production (depuis application.properties ou .env)
        allowedOrigins.add(frontendUrl);
        
        // URLs de développement local
        allowedOrigins.add("http://localhost:5173");     // Vite dev
        allowedOrigins.add("http://localhost:5174");     // Vite dev alternatif
        allowedOrigins.add("http://localhost:3000");     // React classique
        allowedOrigins.add("http://localhost");          // Frontend Docker local
        allowedOrigins.add("http://127.0.0.1:5173");     // Variante 127.0.0.1
        allowedOrigins.add("http://127.0.0.1:5174");
        
        // ✅ Support HTTPS pour la production
        if (frontendUrl.startsWith("https://")) {
            allowedOrigins.add(frontendUrl);
        }
        
        configuration.setAllowedOrigins(allowedOrigins);
        
        // ✅ Méthodes HTTP autorisées
        configuration.setAllowedMethods(List.of(
            "GET", 
            "POST", 
            "PUT", 
            "DELETE", 
            "PATCH",    // ✅ AJOUT: Pour les mises à jour partielles
            "OPTIONS"   // ✅ AJOUT: Pour les requêtes preflight CORS
        ));
<<<<<<< HEAD
        
        // ✅ Headers autorisés
=======

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
>>>>>>> origin/main
        configuration.setAllowedHeaders(List.of("*"));
        
        // ✅ Headers exposés au frontend
        configuration.setExposedHeaders(List.of(
            "Authorization",
            "Content-Type",
            "Set-Cookie"
        ));
        
        // ✅ IMPORTANT: Autoriser les credentials (cookies, JWT)
        configuration.setAllowCredentials(true);
        
        // ✅ Cache de la requête preflight (1 heure)
        configuration.setMaxAge(3600L);

        // Appliquer la configuration CORS à tous les endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}