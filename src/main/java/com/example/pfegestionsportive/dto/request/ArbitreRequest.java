package com.example.pfegestionsportive.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ArbitreRequest {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Email invalide")
    private String email;

    private String telephone;
    private String adresse;
    private LocalDate dateNaissance;
    private String genre;


    private String niveau;
    private String qualification;
    private LocalDate certificationDate;
    private Boolean disponibilite;
    private Integer anneesExperience;
    private String federationArbitrage;
    private String statut;
}
