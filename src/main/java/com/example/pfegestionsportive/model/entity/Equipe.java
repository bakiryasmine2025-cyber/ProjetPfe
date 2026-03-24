package com.example.pfegestionsportive.model.entity;

import com.example.pfegestionsportive.model.enums.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    private String categorie; // SENIOR, JUNIOR, CADET, MINIME, ECOLE

    @Enumerated(EnumType.STRING)
    private Gender genre; // MASCULIN, FEMININ, MIXTE

    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club;

    @ManyToMany
    @JoinTable(
            name = "equipe_joueurs",
            joinColumns = @JoinColumn(name = "equipe_id"),
            inverseJoinColumns = @JoinColumn(name = "joueur_id")
    )
    private List<Joueur> joueurs;
}
