package com.example.pfegestionsportive.model.entity;

import com.example.pfegestionsportive.model.enums.MatchStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "competition_id")
    private Competition competition;

    @ManyToOne
    @JoinColumn(name = "equipe_domicile_id")
    private Equipe equipeDomicile;

    @ManyToOne
    @JoinColumn(name = "equipe_exterieur_id")
    private Equipe equipeExterieur;

    private LocalDateTime dateMatch;

    private String lieu; // Stadium, City

    private Integer scoreDomicile;
    private Integer scoreExterieur;

    @Enumerated(EnumType.STRING)
    private MatchStatus statut;

    @ManyToOne
    @JoinColumn(name = "arbitre_id")
    private Arbitre arbitre;
}
