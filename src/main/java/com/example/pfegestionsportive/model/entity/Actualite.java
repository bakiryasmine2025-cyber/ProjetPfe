package com.example.pfegestionsportive.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "actualites")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Actualite {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String titre;

    @Lob
    @Column(nullable = false)
    private String contenu;

    private String categorie;

    private String urlImage;

    @Builder.Default
    private LocalDateTime datePublication = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club; // Nullable, for federation news
}
