package com.example.pfegestionsportive.model.entity;

import com.example.pfegestionsportive.model.enums.ClubStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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

    private String motifSuspension;


    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ClubStatus statut = ClubStatus.ACTIF;

    @ManyToOne
    @JoinColumn(name = "admin_user_id")
    @JsonIgnoreProperties({"club", "clubsSuivis", "motDePasseHash", "hibernateLazyInitializer"})

    private User adminUser;


    @Builder.Default
    private LocalDateTime dateCreation = LocalDateTime.now();

    private LocalDateTime dateMiseAJour;
}
