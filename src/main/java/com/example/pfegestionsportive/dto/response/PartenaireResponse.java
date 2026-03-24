package com.example.pfegestionsportive.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @AllArgsConstructor
public class PartenaireResponse {
    private String id;
    private String nom;
    private String type;
    private String secteur;
    private String emailContact;
    private String urlLogo;
    private String siteWeb;
    private LocalDate dateDebutContrat;
    private LocalDate dateFinContrat;
    private boolean actif;
    private LocalDateTime dateCreation;
}