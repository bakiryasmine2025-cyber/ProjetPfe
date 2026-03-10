package com.example.pfegestionsportive.model.entity;
import com.example.pfegestionsportive.model.enums.CompetitionCategory;
import com.example.pfegestionsportive.model.enums.CompetitionLevel;
import com.example.pfegestionsportive.model.enums.Gender;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "competitions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Competition {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nom;

    private String saison;

    @Enumerated(EnumType.STRING)
    private CompetitionCategory categorie;

    @Enumerated(EnumType.STRING)
    private Gender genre;

    @Enumerated(EnumType.STRING)
    private CompetitionLevel niveau;

    private LocalDateTime dateCreation;

    private LocalDateTime dateMiseAJour;

    // ✅ Relation avec Federation
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "federation_id")
    private Federation federation;

    // ✅ Relation avec Match
    @OneToMany(mappedBy = "competition", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Match> matchs;

    // ✅ Relation avec Licence
    @OneToMany(mappedBy = "competition", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Licence> licences;

    // ✅ Relation avec Calendrier
    @OneToOne(mappedBy = "competition", cascade = CascadeType.ALL)
    private Calendrier calendrier;

    @PrePersist
    public void prePersist() {
        this.dateCreation = LocalDateTime.now();
        this.dateMiseAJour = LocalDateTime.now();

    }

    @PreUpdate
    public void preUpdate() {
        this.dateMiseAJour = LocalDateTime.now();
    }


}
