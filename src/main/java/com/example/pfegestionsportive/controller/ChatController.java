package com.example.pfegestionsportive.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    @PostMapping
    public ResponseEntity<String> chat(@RequestBody Map<String, Object> body) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    "http://localhost:11434/api/chat",
                    request,
                    String.class
            );
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/analyze-player")
    public ResponseEntity<String> analyzePlayer(@RequestBody Map<String, Object> playerData) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String prompt = String.format("""
        Tu es un expert en analyse de performance sportive pour le rugby.
        Analyse le profil de ce joueur et fournis:
        1. Une évaluation générale du profil
        2. Points forts basés sur son poste
        3. Axes d'amélioration recommandés
        4. Recommandations d'entraînement spécifiques
        
        Profil du joueur:
        - Nom: %s %s
        - Poste: %s
        - Catégorie: %s
        - Saison: %s
        - Statut: %s
        
        Réponds en français de manière professionnelle et structurée.
        """,
                playerData.get("prenom"), playerData.get("nom"),
                playerData.get("poste"), playerData.get("categorie"),
                playerData.get("saison"), playerData.get("statut")
        );

        Map<String, Object> body = Map.of(
                "model", "llama3.2:latest",
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                ),
                "stream", false
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    "http://localhost:11434/api/chat",
                    request,
                    String.class
            );
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
