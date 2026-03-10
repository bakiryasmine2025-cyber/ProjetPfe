package com.example.pfegestionsportive.Config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
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

    private final JwtAuthentificationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // ── Désactiver CSRF ──
                .csrf(AbstractHttpConfigurer::disable)

                // ── CORS ──
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // ── Session stateless ──
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // ── Routes ──
                .authorizeHttpRequests(auth -> auth

                        // ════════════════════════════════════════
                        // ── PUBLIC — pas besoin de token ──
                        // ════════════════════════════════════════
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/auth/verify-email",
                                "/api/auth/resend-verification",
                                "/api/auth/reset-password/demande",
                                "/api/auth/reset-password/confirmer"
                        ).permitAll()

                        // ════════════════════════════════════════
                        // ── SUPER_ADMIN uniquement ──
                        // ════════════════════════════════════════

                        // Gestion utilisateurs
                        .requestMatchers(
                                "/api/utilisateurs",
                                "/api/utilisateurs/**"
                        ).hasRole("SUPER_ADMIN")

                        // Admin logs & comptes
                        .requestMatchers(
                                "/api/admin/logs/**",
                                "/api/admin/comptes/**"
                        ).hasRole("SUPER_ADMIN")

                        // Suspendre/activer fédération
                        .requestMatchers(
                                "/api/federations/*/suspendre",
                                "/api/federations/*/activer",
                                "/api/federations/*/desactiver"
                        ).hasRole("SUPER_ADMIN")

                        // ════════════════════════════════════════
                        // ── SUPER_ADMIN + FEDERATION_ADMIN ──
                        // ════════════════════════════════════════

                        // Fédérations (lecture + paramètres)
                        .requestMatchers(
                                "/api/federations",
                                "/api/federations/**"
                        ).hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN")

                        // Clubs — suspendre/activer
                        .requestMatchers(
                                "/api/clubs/*/suspendre",
                                "/api/clubs/*/activer",
                                "/api/clubs/*/desactiver"
                        ).hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN")

                        // Compétitions
                        .requestMatchers(
                                "/api/competitions",
                                "/api/competitions/**"
                        ).hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN")

                        // Matchs
                        .requestMatchers(
                                "/api/matchs",
                                "/api/matchs/**"
                        ).hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN")

                        // Arbitres
                        .requestMatchers(
                                "/api/arbitres",
                                "/api/arbitres/**"
                        ).hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN")

                        // Rapports
                        .requestMatchers(
                                "/api/rapports",
                                "/api/rapports/**"
                        ).hasAnyRole("SUPER_ADMIN", "FEDERATION_ADMIN")

                        // ════════════════════════════════════════
                        // ── SUPER_ADMIN + CLUB_ADMIN ──
                        // ════════════════════════════════════════

                        // Équipes
                        .requestMatchers(
                                "/api/equipes",
                                "/api/equipes/**"
                        ).hasAnyRole("SUPER_ADMIN", "CLUB_ADMIN")

                        // Joueurs
                        .requestMatchers(
                                "/api/joueurs",
                                "/api/joueurs/**"
                        ).hasAnyRole("SUPER_ADMIN", "CLUB_ADMIN")

                        // Entraîneurs
                        .requestMatchers(
                                "/api/entraineurs",
                                "/api/entraineurs/**"
                        ).hasAnyRole("SUPER_ADMIN", "CLUB_ADMIN")

                        // Staff
                        .requestMatchers(
                                "/api/staff",
                                "/api/staff/**"
                        ).hasAnyRole("SUPER_ADMIN", "CLUB_ADMIN")

                        // Club Admin
                        .requestMatchers(
                                "/api/club-admin",
                                "/api/club-admin/**"
                        ).hasAnyRole("SUPER_ADMIN", "CLUB_ADMIN")

                        // ════════════════════════════════════════
                        // ── TOUS LES RÔLES AUTHENTIFIÉS ──
                        // ════════════════════════════════════════

                        // Clubs (lecture)
                        .requestMatchers(
                                "/api/clubs",
                                "/api/clubs/**"
                        ).authenticated()

                        // Licences
                        .requestMatchers(
                                "/api/licences",
                                "/api/licences/**"
                        ).authenticated()

                        // Personnes
                        .requestMatchers(
                                "/api/personnes",
                                "/api/personnes/**"
                        ).authenticated()

                        // Dashboard
                        .requestMatchers(
                                "/api/dashboard",
                                "/api/dashboard/**"
                        ).authenticated()

                        // Calendrier
                        .requestMatchers(
                                "/api/calendrier",
                                "/api/calendrier/**"
                        ).authenticated()

                        // Profil utilisateur connecté
                        .requestMatchers(
                                "/api/utilisateurs/*/profil"
                        ).authenticated()

                        // ════════════════════════════════════════
                        // ── Tout le reste → authentifié ──
                        // ════════════════════════════════════════
                        .anyRequest().authenticated()
                )

                // ── JWT Filter ──
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // ────────────────────────────────────────────────────────────────────────
    // CORS
    // ────────────────────────────────────────────────────────────────────────
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // React : Vite = 5173 | CRA = 3000
        config.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://localhost:5173"
        ));

        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));

        config.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "X-Requested-With"
        ));

        // Credentials (JWT token)
        config.setAllowCredentials(true);

        // Cache preflight 1h
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
