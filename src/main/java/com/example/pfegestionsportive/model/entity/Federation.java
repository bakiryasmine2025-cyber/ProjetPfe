package com.example.pfegestionsportive.model.entity;

import com.example.pfegestionsportive.model.enums.FederationStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "federation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Federation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String nom;

    private String nomCourt;
    private String pays;
    private String devise;
    private String langueOfficielle;
    private String telephone;
    private String emailContact;
    private String siteWeb;
    private String adresse;
    private String urlLogo;
    private Integer anneeFondation;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private FederationStatus statut = FederationStatus.ACTIVE;

    @Builder.Default
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime dateMiseAJour = LocalDateTime.now();
}
