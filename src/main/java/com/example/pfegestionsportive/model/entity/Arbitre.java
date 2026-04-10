package com.example.pfegestionsportive.model.entity;

import com.example.pfegestionsportive.model.enums.ArbitreStatut;
import com.example.pfegestionsportive.model.enums.RefereeLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "arbitres")
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Arbitre extends Personne {
    @Enumerated(EnumType.STRING)
    private RefereeLevel niveau;

    private String qualification;

    private LocalDate certificationDate;

    private Boolean disponibilite;

    private Integer anneesExperience;

    private String federationArbitrage;

    private String cheminCertification;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ArbitreStatut statut = ArbitreStatut.ACTIF;
}
