package com.example.pfegestionsportive.model.entity;

import com.example.pfegestionsportive.model.enums.EquipeStatut;
import com.example.pfegestionsportive.model.enums.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "equipes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipe {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String nom;
    private String categorie;

    @Enumerated(EnumType.STRING)
    private Gender genre;


    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EquipeStatut statut = EquipeStatut.EN_ATTENTE;

    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club;


    @ManyToOne
    @JoinColumn(name = "competition_id")
    private Competition competition;

    @ManyToMany
    @JoinTable(
            name = "equipe_joueurs",
            joinColumns = @JoinColumn(name = "equipe_id"),
            inverseJoinColumns = @JoinColumn(name = "joueur_id")
    )
    @Builder.Default
    private List<Joueur> joueurs = new ArrayList<>();
}
