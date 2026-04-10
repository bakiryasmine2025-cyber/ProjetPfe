package com.example.pfegestionsportive.dto.response;

import com.example.pfegestionsportive.model.enums.MatchStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarResponse {

    private String id;

    // "MATCH" ou "COMPETITION"
    private String type;

    // Titre affiché dans le calendrier
    private String title;

    private LocalDateTime date;

    private String location;

    // Champs spécifiques aux matchs
    private String equipeDomicile;
    private String equipeExterieur;
    private Integer scoreDomicile;
    private Integer scoreExterieur;
    private MatchStatus statut;

    // Champs spécifiques aux compétitions
    private String competitionNom;
    private String competitionCategorie;
    private String competitionNiveau;
    private String description;
    private boolean active;
}