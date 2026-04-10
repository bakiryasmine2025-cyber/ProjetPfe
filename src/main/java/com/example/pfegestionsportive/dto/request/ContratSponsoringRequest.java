package com.example.pfegestionsportive.dto.request;

import com.example.pfegestionsportive.model.enums.ContractType;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ContratSponsoringRequest {
    private String partenaireId;
    private ContractType typeContrat;
    private BigDecimal montant;
    private String devise;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String description;
}
