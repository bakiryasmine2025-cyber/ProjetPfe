package com.example.pfegestionsportive.Config;

import com.example.pfegestionsportive.Security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        // ───────── CORS PREFLIGHT — TOUJOURS EN PREMIER ─────────
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ───────── PUBLIC ─────────
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/public/**"
                        ).permitAll()

                        // ───────── SUPER ADMIN ─────────
                        .requestMatchers("/api/super-admin/**")
                        .hasAnyRole("SUPER_ADMIN")

                        // ───────── JOUEURS ─────────
                        .requestMatchers(HttpMethod.GET,    "/api/joueurs/**")
                        .hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN", "CLUB_ADMIN", "FAN")
                        .requestMatchers(HttpMethod.POST,   "/api/joueurs/**")
                        .hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN", "CLUB_ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/api/joueurs/**")
                        .hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN", "CLUB_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/joueurs/**")
                        .hasAnyRole("SUPER_ADMIN")

                        // ───────── LICENCES ─────────
                        .requestMatchers(HttpMethod.GET,   "/api/licences/mon-club")
                        .hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN", "CLUB_ADMIN")
                        .requestMatchers(HttpMethod.POST,  "/api/licences")
                        .hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN", "CLUB_ADMIN")
                        .requestMatchers(HttpMethod.POST,  "/api/licences/admin")
                        .hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN")
                        .requestMatchers(HttpMethod.GET,   "/api/licences/**")
                        .hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN", "CLUB_ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/licences/**")
                        .hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN")

                        // ───────── FEDERATION ─────────
                        .requestMatchers("/api/federation/**")
                        .hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN")

                        // ───────── CLUB ADMIN ─────────
                        .requestMatchers("/api/club-admin/**")
                        .hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN", "CLUB_ADMIN")
                        .requestMatchers("/api/club/**")
                        .hasAnyRole("SUPER_ADMIN", "CLUB_ADMIN")

                        // ───────── FAN ─────────
                        .requestMatchers("/api/fan/**")
                        .hasAnyRole("FAN", "SUPER_ADMIN")

                        // ───────── USERS ─────────
                        .requestMatchers("/api/users/**")
                        .hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN", "CLUB_ADMIN", "FAN")

                        // 🔒 TOUT LE RESTE
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://127.0.0.1:5173"
        ));

        config.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        config.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Cache-Control",
                "Accept",
                "Origin",
                "X-Requested-With",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));

        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}