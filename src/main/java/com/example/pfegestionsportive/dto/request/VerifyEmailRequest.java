package com.example.pfegestionsportive.dto.request;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class VerifyEmailRequest {
    @Email(message = "Email invalide")
    @NotBlank(message = "Email obligatoire")
    private String email;

    @NotBlank(message = "Code obligatoire")
    @Size(min = 6, max = 6, message = "Le code doit contenir 6 chiffres")
    private String code;
}

