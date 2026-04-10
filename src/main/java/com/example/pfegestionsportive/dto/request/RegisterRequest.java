package com.example.pfegestionsportive.dto.request;

import com.example.pfegestionsportive.model.enums.Gender;
import com.example.pfegestionsportive.model.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    private String nom;

    @NotBlank
    private String prenom;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6)
    private String password;

    private String telephone;

    @NotNull
    private Role role;

    // Champs joueur — optionnels pour les autres rôles
    private Gender genre;
    private String poste;
    private String categorie;
    private String nomClub;
}