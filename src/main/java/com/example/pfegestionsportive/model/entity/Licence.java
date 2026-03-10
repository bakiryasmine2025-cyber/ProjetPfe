package com.example.pfegestionsportive.model.entity;

import com.example.pfegestionsportive.model.enums.LicenseStatus;
import com.example.pfegestionsportive.model.enums.LicenseType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;


@Entity
@Table(name = "licences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Licence {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String numero;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LicenseType type;

    @Column(nullable = false)
    private LocalDate dateEmission;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LicenseStatus statut;

    private Boolean aptitudeMedicale;

    private LocalDate dateEmission;

    private LocalDate dateExpiration;

    @Enumerated(EnumType.STRING)
    private LicenseStatus statut;

    private Boolean aptitudeMedicale;

    private String motifSuspension;


    // ✅ Relation avec Personne
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personne_id", nullable = false)
    private Personne personne;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id")
    private Club club;

    // Méthodes métier
    public void verifierValidite() {
        if (dateExpiration != null && dateExpiration.isBefore(LocalDate.now())) {
            this.statut = LicenseStatus.EXPIREE;
        }
    }

    public void renouveler(LocalDate nouvelleDateExpiration) {
        this.dateExpiration = nouvelleDateExpiration;
        this.statut = LicenseStatus.ACTIVE;
        this.dateEmission = LocalDate.now();
    }

    public void activerLicence() {
        this.statut = LicenseStatus.ACTIVE;
    }
    }


