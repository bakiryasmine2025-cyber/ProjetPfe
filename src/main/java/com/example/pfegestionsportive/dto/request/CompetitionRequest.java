package com.example.pfegestionsportive.dto.request;

import com.example.pfegestionsportive.model.enums.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CompetitionRequest {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
    private String saison;
    private String description;
    private Integer nombreEquipes;
    private boolean active;

    private CompetitionCategory categorie;
    private RugbyType typeRugby;
    private AgeCategory categorieAge;
    private CompetitionLevel niveau;
    private Gender genre;

    private LocalDate dateDebut;
    private LocalDate dateFin;
}