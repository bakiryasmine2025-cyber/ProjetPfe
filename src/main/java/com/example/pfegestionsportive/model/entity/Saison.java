package com.example.pfegestionsportive.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "saisons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Saison {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String nom;

    private LocalDate dateDebut;
    private LocalDate dateFin;

    @Builder.Default
    private boolean active = false;

    @Builder.Default
    private LocalDateTime dateCreation = LocalDateTime.now();
}