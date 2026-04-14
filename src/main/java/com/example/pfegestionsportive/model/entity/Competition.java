
package com.example.pfegestionsportive.model.entity;

import com.example.pfegestionsportive.model.enums.CompetitionCategory;
import com.example.pfegestionsportive.model.enums.CompetitionLevel;
import com.example.pfegestionsportive.model.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "competitions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Competition {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String nom;

    @Enumerated(EnumType.STRING)
    private CompetitionCategory categorie;

    @Enumerated(EnumType.STRING)
    private RugbyType typeRugby;

    @Enumerated(EnumType.STRING)
    private AgeCategory categorieAge;

    @Enumerated(EnumType.STRING)
    private CompetitionLevel niveau;

    @Enumerated(EnumType.STRING)
    private Gender genre;

    private String saison;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer nombreEquipes;
    private LocalDate dateDebut;
    private LocalDate dateFin;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private LocalDateTime dateCreation = LocalDateTime.now();
}