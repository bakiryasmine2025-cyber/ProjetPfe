package com.example.pfegestionsportive.model.entity;

import com.example.pfegestionsportive.model.enums.PlanningType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "calendriers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Calendrier {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String saison;

    private LocalDateTime dateGeneration;

    @Enumerated(EnumType.STRING)
    private PlanningType typePlanning;

    private LocalDateTime dateCreation;
    private LocalDateTime dateMiseAJour;

    // ✅ Relation avec Competition
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competition_id")
    private Competition competition;

    public void genererCalendrier() {
        this.dateGeneration = LocalDateTime.now();
    }

    public void optimiserPlanning() {}

}
