package com.example.pfegestionsportive.dto.request;

import lombok.Data;

@Data
public class FederationRequest {
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
}
