package com.example.pfegestionsportive.dto.response;

import com.example.pfegestionsportive.model.enums.Gender;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JoueurAvecClubDTO {

    private String id;
    private String nom;
    private String prenom;
    private Gender genre;
    private String poste;
    private String categorie;
    private String telephone;
    private String statut;
    private String clubId;
    private String clubNom;

    private String cin;
    private String numeroLicence;
    private Boolean certificatMedical;

    private int nombreMatchs;
    private int nombreButs;
    private int nombreAssists;
    private int minutesJouees;
    private int plaquagesReussis;
    private int fautes;
    private int cartons;
    private int vitesse;
    private int endurance;
    private int force;

}
