package com.example.pfegestionsportive.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JournalAuditDTO {

    private UUID id;
    private String action;
    private String description;
    private String ipAdresse;
    private LocalDateTime dateAction;
    private String roleUtilisateur;
    private UUID utilisateurId;
    private String emailUtilisateur;
}