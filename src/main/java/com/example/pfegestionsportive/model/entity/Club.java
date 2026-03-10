package com.example.pfegestionsportive.model.entity;
import com.example.pfegestionsportive.model.enums.ClubStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "clubs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Club {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String nom;

    private String nomCourt;

    private String ville;

    private String region;

    private Integer anneeFondation;

    private String urlLogo;

    @Enumerated(EnumType.STRING)
    private ClubStatus statut;

    private LocalDateTime dateCreation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "federation_id")
    private Federation federation;

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL)
    private List<Personne> personnes;

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL)
    private List<Equipe> equipes;

    public void suspendre(String motif) {
        if (this.statut == ClubStatus.SUSPENDU) {
            throw new IllegalStateException("Club déjà suspendu");
        }
        this.statut = ClubStatus.SUSPENDU;
        this.motifSuspension = motif;
        this.dateSuspension = LocalDateTime.now();
    }

    public void activer() {
        this.statut = ClubStatus.ACTIF;
        this.motifSuspension = null;
        this.dateSuspension = null;
    }

    public void desactiver() {
        if (this.statut == ClubStatus.SUSPENDU) {
            throw new IllegalStateException(
                    "Club suspendu — réactivez-le d'abord"
            );
        }
        this.statut = ClubStatus.INACTIF;
    }
}

