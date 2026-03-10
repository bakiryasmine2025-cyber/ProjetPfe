package com.example.pfegestionsportive.dto;

import com.example.pfegestionsportive.model.enums.LicenseType;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DemandeDTO {

    @NotNull(message = "Personne obligatoire")
    private UUID personneId;

    @NotNull(message = "Club obligatoire")
    private UUID clubId;

    @NotNull(message = "Type obligatoire")
    private LicenseType type;

    private Boolean aptitudeMedicale;
}
