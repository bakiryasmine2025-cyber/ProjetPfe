package com.example.pfegestionsportive.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @AllArgsConstructor
public class ClubResponse {
    private String id;
    private String nom;
    private String nomCourt;
    private String ville;
    private String region;
    private Integer anneeFondation;
    private String email;
    private String telephone;
    private String urlLogo;
    private String adresse;
    private String statut;
    private LocalDateTime dateCreation;
    private LocalDateTime dateMiseAJour;
}