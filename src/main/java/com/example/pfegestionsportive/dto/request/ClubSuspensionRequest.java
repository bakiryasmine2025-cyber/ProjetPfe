package com.example.pfegestionsportive.dto.request;

import com.example.pfegestionsportive.model.enums.ClubStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClubSuspensionRequest {
    @NotNull
    private ClubStatus statut; // ACTIF | INACTIF | SUSPENDU | ARCHIVE
    private String motif;      // Obligatoire si SUSPENDU
}
