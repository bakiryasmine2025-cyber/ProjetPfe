package com.example.pfegestionsportive.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class CommandeResponse {
    private String id;
    private BigDecimal montantTotal;
    private String statut;
    private String adresseLivraison;
    private LocalDateTime dateCommande;
    private List<LigneResponse> lignes;

    @Data @Builder
    public static class LigneResponse {
        private String produitNom;
        private Integer quantite;
        private BigDecimal prixUnitaire;
    }
}
