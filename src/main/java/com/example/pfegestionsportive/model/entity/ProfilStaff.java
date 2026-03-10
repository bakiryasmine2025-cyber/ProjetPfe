package com.example.pfegestionsportive.model.entity;

import com.example.pfegestionsportive.model.enums.StaffType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "profil_staffs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfilStaff {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StaffType typeStaff;

    private String qualification;

    private Integer anneesExperience;

    private LocalDateTime dateCreation;
    private LocalDateTime dateMiseAJour;


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personne_id")
    private Personne personne;

    public void consulterMatchs() {}

    public void mettreAJourQualification(String qualification) {
        this.qualification = qualification;
    }
}
