package com.example.pfegestionsportive.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ContactRequest {

    @NotBlank(message = "Nom obligatoire")
    private String nom;

    @NotBlank(message = "Email obligatoire")
    @Email(message = "Email invalide")
    private String email;

    private String telephone;

    @NotBlank(message = "Sujet obligatoire")
    private String sujet;

    @NotBlank(message = "Message obligatoire")
    private String message;
}
