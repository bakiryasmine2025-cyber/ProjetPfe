package com.example.pfegestionsportive.dto.request;

import com.example.pfegestionsportive.model.enums.CompetitionCategory;
import com.example.pfegestionsportive.model.enums.CompetitionLevel;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CompetitionRequest {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    private String saison;           // ex: "2024-2025"

    private String saisonId;         // ID de la saison liée

    private String description;

    private Integer nombreEquipes;

    private boolean active;

    private Boolean isActive;

    private CompetitionCategory categorie;

    private CompetitionLevel niveau;
}