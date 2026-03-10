package com.example.pfegestionsportive.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardFederationDTO {

    // Stats générales
    private long totalClubs;
    private long totalJoueurs;
    private long totalArbitres;
    private long totalCompetitions;

    // Stats licences
    private long licencesActives;
    private long licencesEnAttente;
    private long licencesExpirees;

    // Stats matchs
    private long matchsPlanifies;
    private long matchsTermines;
    private long matchsEnCours;

    // Listes
    private List<MatchDTO> prochainsMatchs;
    private List<CompetitionDTO> competitionsEnCours;
    private List<LicenceDTO> demandesLicenceRecentes;
}