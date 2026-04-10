package com.example.pfegestionsportive.dto.request;

import com.example.pfegestionsportive.model.enums.PartenaireType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class PartenaireRequest {
    @NotBlank
    private String nom;
    private PartenaireType type;
    private String secteur;
    private String emailContact;
    private String urlLogo;
    private String siteWeb;
    private LocalDate dateDebutContrat;
    private LocalDate dateFinContrat;
    private Double montant;
    private boolean actif;
}
