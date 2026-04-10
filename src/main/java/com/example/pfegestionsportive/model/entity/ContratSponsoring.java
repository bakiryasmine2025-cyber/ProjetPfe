package com.example.pfegestionsportive.model.entity;

import com.example.pfegestionsportive.model.enums.ContractType;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "contrats_sponsoring")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContratSponsoring {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "partenaire_id", nullable = false)
    private Partenaire partenaire;

    @Enumerated(EnumType.STRING)
    private ContractType typeContrat;

    private BigDecimal montant;
    private String devise;
    private LocalDate dateDebut;
    private LocalDate dateFin;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private boolean actif = true;

    @Builder.Default
    private LocalDateTime dateCreation = LocalDateTime.now();
}