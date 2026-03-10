package com.example.pfegestionsportive.dto;

import com.example.pfegestionsportive.model.enums.FederationStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FederationDTO {
    private UUID id;

    @NotBlank(message = "Nom obligatoire")
    private String nom;

    private String nomCourt;
    private String pays;
    private String code;
    private String devise;
    private String langueOfficielle;
    private Integer anneeFondation;
    private String telephone;
    private FederationStatus statut;
    private Boolean actif;
    private LocalDateTime dateCreation;
    private LocalDateTime dateMiseAJour;
    private LocalDateTime dateSuspension;
    private int nombreClubs;
}