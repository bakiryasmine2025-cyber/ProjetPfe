package com.example.pfegestionsportive.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfilRequest {

    @Email(message = "Email invalide")
    private String email;

    @Size(min = 6, message = "Mot de passe min 6 caractères")
    private String motDePasse;

    private String telephone;
}