package com.example.pfegestionsportive.Config;

import com.example.pfegestionsportive.Security.JwtFilter;
import com.example.pfegestionsportive.Security.UserDetailsServiceImpl;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth

                        // ── Public ──
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers("/api/chat/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/shop/produits").permitAll()

                        // ── Injury Prevention IA ──
                        .requestMatchers("/api/injury-prevention/**").permitAll()

                        // ── Clubs & Matches (lecture) ──
                        .requestMatchers(HttpMethod.GET, "/api/federation/clubs").hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN", "CLUB_ADMIN", "FAN")
                        .requestMatchers(HttpMethod.GET, "/api/federation/clubs/**").hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN", "CLUB_ADMIN", "FAN")
                        .requestMatchers(HttpMethod.GET, "/api/matches").hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN", "CLUB_ADMIN", "FAN")
                        .requestMatchers(HttpMethod.GET, "/api/matches/**").hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN", "CLUB_ADMIN", "FAN")

                        // ── Super Admin ──
                        .requestMatchers("/api/superadmin/**").hasRole("SUPER_ADMIN")

                        // ── Federation ──
                        .requestMatchers("/api/federation/**").hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN")

                        // ── Club Admin ──
                        .requestMatchers("/api/club-admin/**").hasAnyRole("SUPER_ADMIN", "CLUB_ADMIN", "FEDERATION_ADMIN")

                        // ── Club ──
                        .requestMatchers("/api/club/**").hasAnyRole("SUPER_ADMIN", "CLUB_ADMIN")

                        // ── Fan ──
                        .requestMatchers("/api/fan/**").hasAnyRole("FAN", "SUPER_ADMIN")

                        // ── Shop ──
                        .requestMatchers("/api/shop/**").hasAnyRole("FAN", "SUPER_ADMIN", "FEDERATION_ADMIN", "CLUB_ADMIN")

                        // ── Matches (écriture) ──
                        .requestMatchers("/api/matches/**").hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN")

                        .anyRequest().authenticated()
                )
                .sessionManagement(s -> s
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter,
                        UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}