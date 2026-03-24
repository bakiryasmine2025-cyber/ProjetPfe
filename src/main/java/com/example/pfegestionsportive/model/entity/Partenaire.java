package com.example.pfegestionsportive.model.entity;

import com.example.pfegestionsportive.model.enums.PartenaireType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "partenaires")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Partenaire {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String nom;

    @Enumerated(EnumType.STRING)
    private PartenaireType type;

    private String secteur;
    private String emailContact;
    private String urlLogo;
    private String siteWeb;

    private LocalDate dateDebutContrat;
    private LocalDate dateFinContrat;

    @Builder.Default
    private boolean actif = true;

    @Builder.Default
    private LocalDateTime dateCreation = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club;
}
