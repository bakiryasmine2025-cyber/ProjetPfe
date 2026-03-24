package com.example.pfegestionsportive.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

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
    private String age; // Note: Consider calculating this from dateNaissance

    @OneToOne
    @JoinColumn(name = "licence_id")
    private Licence licence;
}
