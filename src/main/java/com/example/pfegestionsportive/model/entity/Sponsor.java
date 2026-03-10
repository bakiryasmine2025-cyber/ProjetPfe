package com.example.pfegestionsportive.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sponsors")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Sponsor {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String nom;

    private String contact;
    private String email;
    private String telephone;
    private String urlLogo;
    private BigDecimal montantContrat;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private boolean actif;
    private LocalDateTime dateCreation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "federation_id")
    private Federation federation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id")
    private Club club;
}