package com.example.pfegestionsportive.dto.response;

import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
public class LicenceResponse {
    private String id;
    private String numero;
    private String type;
    private LocalDate dateEmission;
    private LocalDate dateExpiration;
    private String statut;
    private Boolean aptitudeMedicale;
    private String personneNom;
    private String clubNom;
    private String motifRefus;
    private String personneId;
}
