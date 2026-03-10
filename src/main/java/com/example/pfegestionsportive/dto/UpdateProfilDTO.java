package com.example.pfegestionsportive.dto;

import jakarta.validation.constraints.Email;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UpdateProfilDTO {

    @Email(message = "Email invalide")
    private String email;

    private String telephone;

    private String ancienMotDePasse;

    private String nouveauMotDePasse;
}
