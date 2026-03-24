package com.example.pfegestionsportive.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity @Table(name = "lignes_commande")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class LigneCommande {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "commande_id")
    private Commande commande;

    @ManyToOne
    @JoinColumn(name = "produit_id")
    private Produit produit;

    private Integer quantite;
    private BigDecimal prixUnitaire;
}