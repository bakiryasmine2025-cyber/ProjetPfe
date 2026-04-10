
package com.example.pfegestionsportive.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @AllArgsConstructor
public class SaisonResponse {
    private String id;
    private String nom;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private boolean active;
    private LocalDateTime dateCreation;
    private String statut;
}