package com.example.pfegestionsportive.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SponsorDTO {

    private UUID id;

    @NotBlank(message = "Nom obligatoire")
    private String nom;

    private String contact;
    private String email;
    private String telephone;
    private String urlLogo;
    private BigDecimal montantContrat;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private boolean actif;
    private LocalDateTime dateCreation;
    private UUID federationId;
    private String nomFederation;
    private UUID clubId;
    private String nomClub;
}