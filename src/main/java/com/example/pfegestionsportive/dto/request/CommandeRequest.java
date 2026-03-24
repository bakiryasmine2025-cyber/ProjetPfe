package com.example.pfegestionsportive.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class CommandeRequest {
    private String adresseLivraison;
    private List<LigneCommandeRequest> lignes;

    @Data
    public static class LigneCommandeRequest {
        private String produitId;
        private Integer quantite;
    }
}
