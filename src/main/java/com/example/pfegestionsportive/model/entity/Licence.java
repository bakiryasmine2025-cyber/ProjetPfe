package com.example.pfegestionsportive.model.entity;

import com.example.pfegestionsportive.model.enums.*;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "licences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Licence {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String numero;

    @Enumerated(EnumType.STRING)
    private LicenceType type;

    private LocalDate dateEmission;
    private LocalDate dateExpiration;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private LicenceStatus statut = LicenceStatus.PENDING;

    private Boolean aptitudeMedicale = false;

    @OneToOne
    @JoinColumn(name = "personne_id")
    private Personne personne;

    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club;
}
