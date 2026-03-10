package com.example.pfegestionsportive.model.entity;
import com.example.pfegestionsportive.model.enums.MatchStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "matchs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private LocalDateTime dateMatch;

    @Column(nullable = false)
    private String lieu;

    private Integer scoreDomicile;

    private Integer scoreExterieur;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchStatus statut;

    private LocalDateTime dateCreation;

    private LocalDateTime dateMiseAJour;

    // ✅ Relation avec Competition
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competition_id", nullable = false)
    private Competition competition;

    // ✅ Equipe Domicile
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipe_domicile_id", nullable = false)
    private Equipe equipeDomicile;

    // ✅ Equipe Exterieur
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipe_exterieur_id", nullable = false)
    private Equipe equipeExterieur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "arbitre_id")
    private ProfilArbitre arbitre;

    @PrePersist
    public void prePersist() {
        this.dateCreation = LocalDateTime.now();
        this.dateMiseAJour = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.dateMiseAJour = LocalDateTime.now();
    }

}
