package com.example.pfegestionsportive.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @AllArgsConstructor
public class ContratSponsoringResponse {
    private String id;
    private String partenaireId, partenaireNom;
    private String typeContrat;
    private BigDecimal montant;
    private String devise, description;
    private LocalDate dateDebut, dateFin;
    private boolean actif;
    private LocalDateTime dateCreation;
}
