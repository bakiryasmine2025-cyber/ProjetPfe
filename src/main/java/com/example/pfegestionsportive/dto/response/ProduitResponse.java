package com.example.pfegestionsportive.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data @Builder
public class ProduitResponse {
    private String id;
    private String nom;
    private String description;
    private BigDecimal prix;
    private Integer stock;
    private String categorie;
    private String urlImage;
    private boolean disponible;
}
