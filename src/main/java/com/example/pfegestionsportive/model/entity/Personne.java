package com.example.pfegestionsportive.model.entity;

import com.example.pfegestionsportive.model.enums.Gender;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "personnes")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Personne {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String nom;
    private String prenom;
    private LocalDate dateNaissance;

    @Enumerated(EnumType.STRING)
    private Gender genre;

    private String telephone;
    private String email;
    private String urlPhoto;

    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club;

    @Builder.Default
    private LocalDateTime dateCreation = LocalDateTime.now();
}
