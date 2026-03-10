package com.example.pfegestionsportive.dto;

import com.example.pfegestionsportive.model.enums.Gender;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PersonneDTO {
    private UUID id;

    @NotBlank(message = "Prénom obligatoire")
    private String prenom;

    @NotBlank(message = "Nom obligatoire")
    private String nom;

    private LocalDate dateNaissance;
    private Gender genre;
    private String nationalite;
    private String email;
    private String telephone;
    private String adresse;
    private String urlPhoto;
    private LocalDateTime dateCreation;

    // Club
    private UUID clubId;
    private String nomClub;

    // Type de personne
    private String typePersonne; // JOUEUR, ENTRAINEUR, STAFF, ARBITRE
}
