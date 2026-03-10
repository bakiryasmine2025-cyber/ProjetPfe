package com.example.pfegestionsportive.dto;

import com.example.pfegestionsportive.model.enums.ClubStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ClubDTO {
    private UUID id;

    @NotBlank(message = "Nom obligatoire")
    private String nom;

    private String nomCourt;
    private String ville;
    private String region;
    private Integer anneeFondation;
    private String urlLogo;
    private ClubStatus statut;
    private LocalDateTime dateCreation;
    private UUID federationId;
    private String nomFederation;
    private String motifSuspension;
    private LocalDateTime dateSuspension;
}
