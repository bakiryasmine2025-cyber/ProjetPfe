package com.example.pfegestionsportive.model.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "joueurs")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Joueur extends Personne {

    private String categorie;
    private String saison;
    private String statut;
    private String poste;
    private String age;

    private String cin;
    private String numeroLicence;

    @Builder.Default
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean certificatMedical = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id")
    @JsonIgnoreProperties({"joueurs", "adminUser", "hibernateLazyInitializer"})
    private Club club;

    @Column(name = "nombre_matchs", nullable = false)
    private int nombreMatchs = 0;

    @Column(name = "nombre_buts", nullable = false)
    private int nombreButs = 0;

    @Column(name = "nombre_assists", nullable = false)
    private int nombreAssists = 0;

    @Column(name = "minutes_jouees", nullable = false)
    private int minutesJouees = 0;

    @Column(name = "plaquages_reussis", nullable = false)
    private int plaquagesReussis = 0;

    @Column(name = "fautes", nullable = false)
    private int fautes = 0;

    @Column(name = "cartons", nullable = false)
    private int cartons = 0;


    @Column(name = "vitesse", nullable = false)
    private int vitesse = 0;

    @Column(name = "endurance", nullable = false)
    private int endurance = 0;

    @Column(name = "force_joueur", nullable = false)
    private int force = 0;

    @OneToOne
    @JoinColumn(name = "licence_joueur_id")
    private Licence licence;

}
