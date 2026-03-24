package com.example.pfegestionsportive.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tickets")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Ticket {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "match_id")
    private Match match;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String categorie; // TRIBUNE, VIP, PELOUSE
    private BigDecimal prix;
    private String statut; // RESERVE, PAYE, ANNULE
    private String codeTicket;
    private LocalDateTime dateAchat;
    private LocalDateTime dateValidation; // scan à l'entrée

    @PrePersist
    public void prePersist() {
        if (this.dateAchat == null)
            this.dateAchat = LocalDateTime.now();
        if (this.statut == null)
            this.statut = "RESERVE";
        if (this.codeTicket == null)
            this.codeTicket = UUID.randomUUID().toString();
    }
}
