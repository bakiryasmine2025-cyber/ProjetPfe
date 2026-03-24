package com.example.pfegestionsportive.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/injury-prevention")
@RequiredArgsConstructor
public class InjuryPreventionController {

    private static final String OLLAMA_URL = "http://localhost:11434/api/chat";

    // ── Analyse risque blessures pour un joueur ──────────────────────────────
    @PostMapping("/analyze")
    public ResponseEntity<String> analyzeInjuryRisk(
            @RequestBody Map<String, Object> data) {

        String prompt = buildPrompt(data);

        Map<String, Object> body = Map.of(
                "model", "llama3.2:latest",
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                ),
                "stream", false
        );

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    OLLAMA_URL, request, String.class
            );
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // ── Analyse pour toute une équipe ────────────────────────────────────────
    @PostMapping("/analyze-team")
    public ResponseEntity<String> analyzeTeamRisk(
            @RequestBody Map<String, Object> data) {

        String prompt = buildTeamPrompt(data);

        Map<String, Object> body = Map.of(
                "model", "llama3.2:latest",
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                ),
                "stream", false
        );

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    OLLAMA_URL, request, String.class
            );
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // ── Conseils généraux selon météo ────────────────────────────────────────
    @PostMapping("/weather-advice")
    public ResponseEntity<String> getWeatherAdvice(
            @RequestBody Map<String, Object> meteo) {

        String prompt = buildWeatherPrompt(meteo);

        Map<String, Object> body = Map.of(
                "model", "llama3.2:latest",
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                ),
                "stream", false
        );

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    OLLAMA_URL, request, String.class
            );
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Builders de prompts
    // ─────────────────────────────────────────────────────────────────────────

    private String buildPrompt(Map<String, Object> data) {
        return String.format("""
            Tu es un médecin sportif expert en rugby et prévention des blessures.
            
            Analyse le risque de blessure pour ce joueur selon les conditions suivantes :
            
            JOUEUR :
            - Nom : %s
            - Poste : %s
            - Âge : %s ans
            - Catégorie : %s
            
            CONDITIONS MÉTÉO :
            - Température : %s°C
            - Humidité : %s%%
            - Conditions : %s
            
            TYPE DE TERRAIN : %s
            
            Réponds en français avec cette structure exacte :
            
            🎯 NIVEAU DE RISQUE : [FAIBLE / MODÉRÉ / ÉLEVÉ / CRITIQUE]
            
            ⚠️ BLESSURES PROBABLES :
            - [liste des blessures les plus probables selon le poste et les conditions]
            
            🛡️ MESURES PRÉVENTIVES :
            - [liste de mesures concrètes]
            
            🏋️ ÉCHAUFFEMENT RECOMMANDÉ :
            - [durée et exercices spécifiques]
            
            💊 ÉQUIPEMENT CONSEILLÉ :
            - [protections, chaussures adaptées, etc.]
            
            Sois précis, concis et professionnel.
            """,
                data.getOrDefault("nom", "Joueur"),
                data.getOrDefault("poste", "Non spécifié"),
                data.getOrDefault("age", "N/A"),
                data.getOrDefault("categorie", "Senior"),
                data.getOrDefault("temperature", "20"),
                data.getOrDefault("humidite", "50"),
                data.getOrDefault("conditions", "Ensoleillé"),
                data.getOrDefault("terrain", "Gazon naturel")
        );
    }

    private String buildTeamPrompt(Map<String, Object> data) {
        return String.format("""
            Tu es un médecin sportif expert en rugby et prévention des blessures.
            
            Analyse le risque global de blessures pour une équipe de rugby selon :
            
            CONDITIONS MÉTÉO :
            - Température : %s°C
            - Humidité : %s%%
            - Conditions : %s
            
            TYPE DE TERRAIN : %s
            TYPE DE MATCH : %s
            
            Donne une analyse globale pour l'équipe avec :
            
            📊 RISQUE GLOBAL ÉQUIPE : [FAIBLE / MODÉRÉ / ÉLEVÉ / CRITIQUE]
            
            🎯 POSTES LES PLUS À RISQUE :
            - [liste des postes avec risques spécifiques]
            
            ⚠️ ZONES DU CORPS À SURVEILLER :
            - [articulations, muscles selon les conditions]
            
            🛡️ PROTOCOLE PRÉVENTIF ÉQUIPE :
            - [mesures collectives à prendre]
            
            🌡️ GESTION DES CONDITIONS MÉTÉO :
            - [adaptation à la température et humidité]
            
            Réponds en français de manière professionnelle et structurée.
            """,
                data.getOrDefault("temperature", "20"),
                data.getOrDefault("humidite", "50"),
                data.getOrDefault("conditions", "Ensoleillé"),
                data.getOrDefault("terrain", "Gazon naturel"),
                data.getOrDefault("typeMatch", "Match officiel")
        );
    }

    private String buildWeatherPrompt(Map<String, Object> meteo) {
        return String.format("""
            Tu es un expert en médecine sportive pour le rugby.
            
            Donne des conseils de prévention des blessures pour les conditions météo suivantes :
            
            - Température : %s°C
            - Humidité : %s%%
            - Conditions : %s
            - Terrain : %s
            
            Structure ta réponse ainsi :
            
            🌤️ ANALYSE DES CONDITIONS : [description rapide du risque météo]
            
            ⚡ RISQUES PRINCIPAUX :
            - [risques liés à ces conditions]
            
            ✅ RECOMMANDATIONS :
            - [conseils pratiques pour jouer en sécurité]
            
            🚫 À ÉVITER :
            - [ce qu'il ne faut pas faire dans ces conditions]
            
            Réponds en français, de façon claire et concise.
            """,
                meteo.getOrDefault("temperature", "20"),
                meteo.getOrDefault("humidite", "50"),
                meteo.getOrDefault("conditions", "Ensoleillé"),
                meteo.getOrDefault("terrain", "Gazon naturel")
        );
    }
}