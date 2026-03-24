package com.example.pfegestionsportive.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String nom;
    private String email;
    private String telephone;
    private String role;
    private String statut;
    private LocalDateTime derniereConnexion;
    private LocalDateTime dateCreation;
}