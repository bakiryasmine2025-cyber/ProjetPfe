package com.example.pfegestionsportive.dto.request;

import com.example.pfegestionsportive.model.enums.LicenceType;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class LicenceRequest {



    @NotNull(message = "Le type de licence est obligatoire")
    private LicenceType type;

    @NotNull(message = "La date d'émission est obligatoire")
    private LocalDate dateEmission;

    @NotNull(message = "La date d'expiration est obligatoire")
    private LocalDate dateExpiration;

    private Boolean aptitudeMedicale;

    @NotBlank(message = "L'ID de la personne est obligatoire")
    private String personneId;
}
