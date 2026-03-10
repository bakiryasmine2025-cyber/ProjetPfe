package com.example.pfegestionsportive.dto;

import com.example.pfegestionsportive.model.enums.LicenseStatus;
import com.example.pfegestionsportive.model.enums.LicenseType;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LicenceDTO {
    private UUID id;
    private String numero;

    @NotNull(message = "Type obligatoire")
    private LicenseType type;

    private LocalDate dateEmission;
    private LocalDate dateExpiration;
    private LicenseStatus statut;
    private Boolean aptitudeMedicale;
    private String motifSuspension;

    // Infos personne
    private UUID personneId;
    private String nomPersonne;
    private String prenomPersonne;

    // Infos club
    private UUID clubId;
    private String nomClub;
}
