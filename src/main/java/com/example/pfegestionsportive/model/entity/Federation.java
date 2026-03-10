package com.example.pfegestionsportive.model.entity;
import com.example.pfegestionsportive.model.enums.FederationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "federations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Federation {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String nom;

    private String nomCourt;

    private String pays;

    private String code;

    private String devise;

    private String langueOfficielle;

    private Integer anneeFondation;

    private String telephone;

    @Enumerated(EnumType.STRING)
    private FederationStatus statut;

    private Boolean actif;

    private LocalDateTime dateCreation;

    private LocalDateTime dateMiseAJour;

    @OneToMany(mappedBy = "federation", cascade = CascadeType.ALL)
    private List<Club> clubs;

    @OneToMany(mappedBy = "federation", cascade = CascadeType.ALL)
    private List<Competition> competitions;

    public void suspendre(String motif) {
        if (this.statut == FederationStatus.SUSPENDUE) {
            throw new IllegalStateException("Fédération déjà suspendue");
        }
        this.statut = FederationStatus.SUSPENDUE;
        this.actif = false;
        this.motifSuspension = motif;
        this.dateSuspension = LocalDateTime.now();
        this.dateMiseAJour = LocalDateTime.now();
    }

    public void activer() {
        this.statut = FederationStatus.ACTIVE;
        this.actif = true;
        this.motifSuspension = null;
        this.dateSuspension = null;
        this.dateMiseAJour = LocalDateTime.now();

    }

    public void desactiver() {
        if (this.statut == FederationStatus.SUSPENDUE) {
            throw new IllegalStateException(
                    "Fédération suspendue — réactivez-la d'abord"
            );
        }
        this.statut = FederationStatus.INACTIVE;
        this.actif = false;
        this.dateMiseAJour = LocalDateTime.now();
    }
}
