package com.example.pfegestionsportive.model.entity;

import com.example.pfegestionsportive.model.enums.ClubStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "clubs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String nom;

    private String nomCourt;
    private String ville;
    private String region;
    private Integer anneeFondation;
    private String email;
    private String telephone;
    private String urlLogo;
    private String adresse;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ClubStatus statut = ClubStatus.ACTIF;

    @Builder.Default
    private LocalDateTime dateCreation = LocalDateTime.now();

    private LocalDateTime dateMiseAJour;
}
