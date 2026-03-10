package com.example.pfegestionsportive.model.entity;

import com.example.pfegestionsportive.model.enums.Gender;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "personnes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Personne {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false)
    private String nom;

    private LocalDate dateNaissance;

    private String email;

    @Enumerated(EnumType.STRING)
    private Gender genre;

    private String nationalite;

    private String qualification;

    private String adresse;

    private String telephone;

    private String urlPhoto;

    private LocalDateTime dateCreation;

    // ✅ Relation avec Club
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id")
    private Club club;

    // ✅ Relation avec ProfilStaff
    @OneToOne(mappedBy = "personne", cascade = CascadeType.ALL)
    private ProfilStaff profilStaff;

    // ✅ Relation avec ProfilArbitre
    @OneToOne(mappedBy = "personne", cascade = CascadeType.ALL)
    private ProfilArbitre profilArbitre;

    // ✅ Relation avec AffectationEquipe
    @OneToMany(mappedBy = "personne", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.List<AffectationEquipe> affectations;

    // ✅ Relation avec Licence
    @OneToMany(mappedBy = "personne", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.List<Licence> licences;

    @PrePersist
    public void prePersist() {
        this.dateCreation = LocalDateTime.now();
    }
}