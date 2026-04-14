package com.example.pfegestionsportive.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompetitionResponse {
    private String id;
    private String nom;
    private String description;
    private String saison;
    private Integer nombreEquipes;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private boolean active;

    private String categorie;
    private String typeRugby;
    private String categorieAge;
    private String niveau;
    private String genre;

    private LocalDateTime dateCreation;
}