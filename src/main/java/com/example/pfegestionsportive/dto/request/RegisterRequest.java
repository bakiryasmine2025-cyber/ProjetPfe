package com.example.pfegestionsportive.dto.request;

import com.example.pfegestionsportive.model.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    private String nom;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6)
    private String password;

    private String telephone;

    @NotNull
    private Role role;
}
