package com.example.pfegestionsportive.dto;

import com.example.pfegestionsportive.model.enums.Role;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UtilisateurDTO {
    private UUID id;
    private String email;
    private String telephone;
    private Role role;
    private Boolean actif;
    private LocalDateTime derniereConnexion;
    private LocalDateTime dateCreation;
}