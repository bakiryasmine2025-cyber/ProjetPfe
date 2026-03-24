package com.example.pfegestionsportive.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String nom;
    private String telephone;

    @Size(min = 6, message = "Mot de passe min 6 caractères")
    private String newPassword;
}