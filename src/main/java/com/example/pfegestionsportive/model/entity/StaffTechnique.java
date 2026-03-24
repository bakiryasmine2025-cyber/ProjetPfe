package com.example.pfegestionsportive.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "staff_technique")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class StaffTechnique extends Personne {

    private String typeStaff; // e.g., Entraîneur, Préparateur physique, Kiné
    private String qualification;
    private Integer anneeExperience;
    private String statut; // e.g., Actif, Inactif
}
