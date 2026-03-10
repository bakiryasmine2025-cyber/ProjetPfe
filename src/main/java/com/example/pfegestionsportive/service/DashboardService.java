package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.*;
import com.example.pfegestionsportive.model.enums.LicenseStatus;
import com.example.pfegestionsportive.model.enums.MatchStatus;
import com.example.pfegestionsportive.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ClubRepository clubRepository;
    private final PersonneRepository personneRepository;
    private final MatchRepository matchRepository;
    private final LicenceRepository licenceRepository;
    private final CompetitionRepository competitionRepository;
    private final EquipeRepository equipeRepository;

    // ─── User story 6.1 — Dashboard Fédération ───────────────────────────────

    public DashboardFederationDTO getDashboardFederation(UUID federationId) {

        long totalClubs = clubRepository.countByFederationId(federationId);
        long totalJoueurs = personneRepository.countJoueursByFederationId(federationId);
        long totalArbitres = personneRepository.countArbitresByFederationId(federationId);
        long totalCompetitions = competitionRepository.countByFederationId(federationId);

        long licencesActives = licenceRepository.countByStatut(LicenseStatus.ACTIVE);
        long licencesEnAttente = licenceRepository.countByStatut(LicenseStatus.EN_ATTENTE);
        long licencesExpirees = licenceRepository.countByStatut(LicenseStatus.EXPIREE);

        long matchsPlanifies = matchRepository.countByStatut(MatchStatus.PLANIFIE);
        long matchsTermines = matchRepository.countByStatut(MatchStatus.TERMINE);
        long matchsEnCours = matchRepository.countByStatut(MatchStatus.EN_COURS);

        List<MatchDTO> prochainsMatchs = matchRepository
                .findTop5ByStatutAndDateMatchAfterOrderByDateMatchAsc(
                        MatchStatus.PLANIFIE, LocalDateTime.now())
                .stream().map(this::matchToDTO).collect(Collectors.toList());

        List<CompetitionDTO> competitionsEnCours = competitionRepository
                .findByFederationId(federationId)
                .stream().map(this::competitionToDTO).collect(Collectors.toList());

        List<LicenceDTO> demandesRecentes = licenceRepository
                .findTop5ByStatutOrderByDateEmissionDesc(LicenseStatus.EN_ATTENTE)
                .stream().map(this::licenceToDTO).collect(Collectors.toList());

        return DashboardFederationDTO.builder()
                .totalClubs(totalClubs)
                .totalJoueurs(totalJoueurs)
                .totalArbitres(totalArbitres)
                .totalCompetitions(totalCompetitions)
                .licencesActives(licencesActives)
                .licencesEnAttente(licencesEnAttente)
                .licencesExpirees(licencesExpirees)
                .matchsPlanifies(matchsPlanifies)
                .matchsTermines(matchsTermines)
                .matchsEnCours(matchsEnCours)
                .prochainsMatchs(prochainsMatchs)
                .competitionsEnCours(competitionsEnCours)
                .demandesLicenceRecentes(demandesRecentes)
                .build();
    }

    // ─── User story 6.1 — Dashboard Club ─────────────────────────────────────

    public DashboardClubDTO getDashboardClub(UUID clubId) {

        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new EntityNotFoundException("Club non trouvé"));

        long totalJoueurs = personneRepository.countJoueursByClubId(clubId);
        long totalEntraineurs = personneRepository.countEntraineursByClubId(clubId);
        long totalStaff = personneRepository.countStaffByClubId(clubId);
        long totalEquipes = equipeRepository.countByClubId(clubId);

        long licencesActives = licenceRepository.countByClubIdAndStatut(clubId, LicenseStatus.ACTIVE);
        long licencesEnAttente = licenceRepository.countByClubIdAndStatut(clubId, LicenseStatus.EN_ATTENTE);
        long licencesExpirees = licenceRepository.countByClubIdAndStatut(clubId, LicenseStatus.EXPIREE);

        long matchsJoues = matchRepository.countMatchsJouesByClubId(clubId);
        long matchsGagnes = matchRepository.countMatchsGagnesByClubId(clubId);
        long matchsNuls = matchRepository.countMatchsNulsByClubId(clubId);
        long matchsPerdus = matchsJoues - matchsGagnes - matchsNuls;

        List<MatchDTO> prochainsMatchs = matchRepository
                .findProchainsMatchsByClubId(clubId, LocalDateTime.now())
                .stream().map(this::matchToDTO).collect(Collectors.toList());

        List<EquipeDTO> equipes = equipeRepository.findByClubId(clubId)
                .stream().map(this::equipeToDTO).collect(Collectors.toList());

        List<LicenceDTO> licencesARenouveler = licenceRepository
                .findLicencesExpirantBientot(clubId, LocalDateTime.now().plusDays(30).toLocalDate())
                .stream().map(this::licenceToDTO).collect(Collectors.toList());

        return DashboardClubDTO.builder()
                .nomClub(club.getNom())
                .urlLogo(club.getUrlLogo())
                .totalJoueurs(totalJoueurs)
                .totalEntraineurs(totalEntraineurs)
                .totalStaff(totalStaff)
                .totalEquipes(totalEquipes)
                .licencesActives(licencesActives)
                .licencesEnAttente(licencesEnAttente)
                .licencesExpirees(licencesExpirees)
                .matchsJoues(matchsJoues)
                .matchsGagnes(matchsGagnes)
                .matchsNuls(matchsNuls)
                .matchsPerdus(matchsPerdus)
                .prochainsMatchs(prochainsMatchs)
                .equipes(equipes)
                .licencesARenouveler(licencesARenouveler)
                .build();
    }

    // ─── Mappers internes ─────────────────────────────────────────────────────

    private MatchDTO matchToDTO(com.example.pfegestionsportive.entity.Match m) {
        return MatchDTO.builder()
                .id(m.getId())
                .dateMatch(m.getDateMatch())
                .lieu(m.getLieu())
                .scoreDomicile(m.getScoreDomicile())
                .scoreExterieur(m.getScoreExterieur())
                .statut(m.getStatut())
                .nomEquipeDomicile(m.getEquipeDomicile() != null ? m.getEquipeDomicile().getNom() : null)
                .nomEquipeExterieur(m.getEquipeExterieur() != null ? m.getEquipeExterieur().getNom() : null)
                .nomCompetition(m.getCompetition() != null ? m.getCompetition().getNom() : null)
                .build();
    }

    private CompetitionDTO competitionToDTO(com.example.pfegestionsportive.entity.Competition c) {
        return CompetitionDTO.builder()
                .id(c.getId())
                .nom(c.getNom())
                .saison(c.getSaison())
                .categorie(c.getCategorie())
                .niveau(c.getNiveau())
                .build();
    }

    private LicenceDTO licenceToDTO(com.example.pfegestionsportive.entity.Licence l) {
        return LicenceDTO.builder()
                .id(l.getId())
                .numero(l.getNumero())
                .type(l.getType())
                .statut(l.getStatut())
                .dateExpiration(l.getDateExpiration())
                .build();
    }

    private EquipeDTO equipeToDTO(com.example.pfegestionsportive.entity.Equipe e) {
        return EquipeDTO.builder()
                .id(e.getId())
                .nom(e.getNom())
                .genre(e.getGenre())
                .trancheAge(e.getTrancheAge())
                .build();
    }
}
