package com.example.pfegestionsportive.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @AllArgsConstructor
public class FederationResponse {
    private String id;
    private String nom, nomCourt, pays, devise;
    private String langueOfficielle, telephone, emailContact;
    private String siteWeb, adresse, urlLogo, statut;
    private Integer anneeFondation;
    private LocalDateTime dateCreation, dateMiseAJour;
}
