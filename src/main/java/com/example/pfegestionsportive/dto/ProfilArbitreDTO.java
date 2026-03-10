package com.example.pfegestionsportive.dto;

import com.example.pfegestionsportive.model.enums.Refereelevel;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProfilArbitreDTO {
    private UUID id;
    private UUID personneId;
    private String nomPersonne;
    private String prenomPersonne;
    private Refereelevel niveau;
    private LocalDate certificationDate;
    private Boolean disponibilite;
}
