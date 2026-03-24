package com.example.pfegestionsportive.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity @Table(name = "commandes")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Commande {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private BigDecimal montantTotal;
    private String statut; // EN_ATTENTE, CONFIRMEE, LIVREE, ANNULEE
    private String adresseLivraison;
    private LocalDateTime dateCommande;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL)
    private List<LigneCommande> lignes;
}
