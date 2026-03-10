package com.example.pfegestionsportive.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "journal_audit")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JournalAudit {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String action;

    private String description;

    private String ipAdresse;

    @Column(nullable = false)
    private LocalDateTime dateAction;

    @Column(nullable = false)
    private String roleUtilisateur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;
}