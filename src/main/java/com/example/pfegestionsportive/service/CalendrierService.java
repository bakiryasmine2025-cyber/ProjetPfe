package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.CalendrierDTO;
import com.example.pfegestionsportive.dto.MatchDTO;
import com.example.pfegestionsportive.model.entity.Calendrier;
import com.example.pfegestionsportive.model.entity.Competition;
import com.example.pfegestionsportive.model.enums.PlanningType;
import com.example.pfegestionsportive.repository.CalendrierRepository;
import com.example.pfegestionsportive.repository.CompetitionRepository;
import com.example.pfegestionsportive.repository.MatchRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendrierService {

    private final CalendrierRepository calendrierRepository;
    private final CompetitionRepository competitionRepository;
    private final MatchRepository matchRepository;

    // ─── User story 6.2 — Visualiser tous les calendriers ────────────────────

    public List<CalendrierDTO> getAll() {
        return calendrierRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ─── User story 6.2 — Visualiser par saison ──────────────────────────────

    public List<CalendrierDTO> getBySaison(String saison) {
        return calendrierRepository.findBySaison(saison)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ─── User story 6.2 — Visualiser par compétition ─────────────────────────

    public CalendrierDTO getByCompetition(UUID competitionId) {
        return calendrierRepository.findByCompetitionId(competitionId)
                .stream().findFirst()
                .map(this::toDTO)
                .orElseThrow(() -> new EntityNotFoundException("Calendrier non trouvé"));
    }

    // ─── User story 6.2 — Visualiser matchs par club ─────────────────────────

    public List<MatchDTO> getMatchsParClub(UUID clubId, String saison) {
        return matchRepository.findMatchsByClubIdAndSaison(clubId, saison)
                .stream().map(this::matchToDTO).collect(Collectors.toList());
    }

    // ─── Créer calendrier (FEDERATION_ADMIN) ─────────────────────────────────

    public CalendrierDTO creerCalendrier(UUID competitionId, PlanningType typePlanning) {
        Competition competition = competitionRepository.findById(competitionId)
                .orElseThrow(() -> new EntityNotFoundException("Compétition non trouvée"));

        Calendrier calendrier = Calendrier.builder()
                .saison(competition.getSaison())
                .dateGeneration(LocalDateTime.now())
                .typePlanning(typePlanning)
                .competition(competition)
                .build();

        return toDTO(calendrierRepository.save(calendrier));
    }

    // ─── Supprimer ────────────────────────────────────────────────────────────

    public void delete(UUID id) {
        if (!calendrierRepository.existsById(id)) {
            throw new EntityNotFoundException("Calendrier non trouvé");
        }
        calendrierRepository.deleteById(id);
    }

    // ─── Mappers ──────────────────────────────────────────────────────────────

    private CalendrierDTO toDTO(Calendrier c) {
        List<MatchDTO> matchs = matchRepository
                .findByCompetitionId(c.getCompetition().getId())
                .stream().map(this::matchToDTO).collect(Collectors.toList());

        return CalendrierDTO.builder()
                .id(c.getId())
                .saison(c.getSaison())
                .dateGeneration(c.getDateGeneration())
                .typePlanning(c.getTypePlanning())
                .competitionId(c.getCompetition().getId())
                .nomCompetition(c.getCompetition().getNom())
                .matchs(matchs)
                .build();
    }

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
}