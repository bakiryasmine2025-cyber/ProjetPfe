package com.example.pfegestionsportive.dto.request;

import com.example.pfegestionsportive.model.enums.CompetitionCategory;
import com.example.pfegestionsportive.model.enums.CompetitionLevel;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CompetitionRequest {
    @NotBlank
    private String nom;
    private CompetitionCategory categorie;
    private CompetitionLevel niveau;
    private String saisonId;
    private String description;
    private Integer nombreEquipes;
    private boolean active;
}
