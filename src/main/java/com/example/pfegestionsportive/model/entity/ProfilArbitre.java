package com.example.pfegestionsportive.model.entity;

import com.example.pfegestionsportive.model.enums.Refereelevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "profil_arbitres")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfilArbitre {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Refereelevel niveau;

    private String qualification;

    private LocalDate certificationDate;

    private Boolean disponibilite;

    private LocalDateTime dateCreation;

    private LocalDateTime dateMiseAJour;

    // ✅ Relation avec Personne
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personne_id", nullable = false)
    private Personne personne;

    public void arbitrerMatch() {}

    public void mettreAJourDisponibilite(Boolean disponibilite) {
        this.disponibilite = disponibilite;
    }


    }


