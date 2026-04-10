package com.example.pfegestionsportive.dto.request;

import com.example.pfegestionsportive.model.enums.Gender;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AddJoueurRequest {
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private Gender genre;
    private String telephone;
    private String email;
    private String poste;
    private String categorie;
    private String clubId;
    private String cin;
    private String numeroLicence;
    private Boolean certificatMedical;

    private int nombreMatchs = 5;
    private int nombreButs = 3;
    private int nombreAssists = 2;
    private int minutesJouees = 6;
    private int plaquagesReussis = 7;
    private int fautes = 4;
    private int cartons = 3;



    private int vitesse = 8;
    private int endurance = 4;
    private int force = 6;
}
