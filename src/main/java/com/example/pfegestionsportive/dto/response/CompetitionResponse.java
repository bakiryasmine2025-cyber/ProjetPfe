
package com.example.pfegestionsportive.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @AllArgsConstructor
public class CompetitionResponse {
    private String id;
    private String nom;
    private String categorie;
    private String niveau;
    private String saisonId;
    private String saisonNom;
    private String description;
    private Integer nombreEquipes;
    private boolean active;
    private LocalDateTime dateCreation;
}