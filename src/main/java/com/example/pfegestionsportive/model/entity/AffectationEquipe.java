package com.example.pfegestionsportive.model.entity;
import com.example.pfegestionsportive.model.enums.TeamRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "affectations_equipe")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AffectationEquipe {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TeamRole role;

    private Integer numMaillot;

    private LocalDateTime dateCreation;

    private LocalDateTime dateMiseAJour;

    // ✅ Relation avec Personne
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personne_id", nullable = false)
    private Personne personne;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipe_id", nullable = false)
    private Equipe equipe;

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
