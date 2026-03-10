package com.example.pfegestionsportive.model.entity;
import com.example.pfegestionsportive.model.enums.Gender;
import com.example.pfegestionsportive.model.enums.TeamCategory;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "equipes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipe {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nom;

    @Enumerated(EnumType.STRING)
    private TeamCategory categorie;

    @Enumerated(EnumType.STRING)
    private Gender genre;

    private String trancheAge;

    private String saison;

    private LocalDateTime dateCreation;

    private LocalDateTime dateMiseAJour;

    // ✅ Relation avec Club
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    // ✅ Relation avec AffectationEquipe
    @OneToMany(mappedBy = "equipe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AffectationEquipe> affectations;

    // ✅ Matchs Domicile
    @OneToMany(mappedBy = "equipeDomicile", fetch = FetchType.LAZY)
    private List<Match> matchsDomicile;

    @OneToMany(mappedBy = "equipeExterieur", fetch = FetchType.LAZY)
    private List<Match> matchsExterieur;

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
