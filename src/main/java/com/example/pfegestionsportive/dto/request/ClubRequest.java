package com.example.pfegestionsportive.dto.request;

import com.example.pfegestionsportive.model.enums.ClubStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClubRequest {
    @NotBlank
    private String nom;
    private String nomCourt;
    @NotBlank
    private String ville;
    private String region;
    private Integer anneeFondation;
    private String email;
    private String telephone;
    private String urlLogo;
    private String adresse;
    private ClubStatus statut;
}
