package com.example.pfegestionsportive.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity @Table(name = "produits")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Produit {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String nom;
    private String description;
    private BigDecimal prix;
    private Integer stock;
    private String categorie; // MAILLOT, ACCESSOIRE, EQUIPEMENT
    private String urlImage;
    private boolean disponible;
}
