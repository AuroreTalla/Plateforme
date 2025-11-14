package com.example.plateformeback.config;

import com.example.plateformeback.jwt.JwtFilter;
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

import java.util.List;

@Configuration
@EnableWebSecurity
public class ConfigurationApp {

    private final AuthentificationConfig authentificationConfig;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JwtFilter jwtFilter;
    private final UserDetailsService userDetailsService;

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
                .cors(cors -> {})
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/users/**").permitAll()
                        .requestMatchers("/groupes/**").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/app/**").permitAll()
                        .anyRequest().authenticated()
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

        // ✅ Accepte localhost:5173 (React) ET tous les autres origins (HTML local)
        configuration.setAllowedOriginPatterns(List.of("*"));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}