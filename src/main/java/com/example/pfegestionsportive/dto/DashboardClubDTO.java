package com.example.pfegestionsportive.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardClubDTO {

    // Infos club
    private String nomClub;
    private String urlLogo;

    // Effectif
    private long totalJoueurs;
    private long totalEntraineurs;
    private long totalStaff;
    private long totalEquipes;

    // Licences
    private long licencesActives;
    private long licencesEnAttente;
    private long licencesExpirees;

    // Résultats matchs
    private long matchsJoues;
    private long matchsGagnes;
    private long matchsNuls;
    private long matchsPerdus;

    // Listes
    private List<MatchDTO> prochainsMatchs;
    private List<EquipeDTO> equipes;
    private List<LicenceDTO> licencesARenouveler;
}
