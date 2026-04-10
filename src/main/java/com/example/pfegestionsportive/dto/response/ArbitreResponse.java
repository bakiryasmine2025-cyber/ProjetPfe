package com.example.pfegestionsportive.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArbitreResponse {

    private String id;
    private String nom;
    private String prenom;
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
    private String cheminCertification;
    private String statut;
}
