package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.model.entity.*;
import com.example.pfegestionsportive.model.enums.MatchStatus;
import com.example.pfegestionsportive.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MatchService {

    private final MatchRepository matchRepository;
    private final EquipeRepository equipeRepository;
    private final CompetitionRepository competitionRepository;

    // ── CRUD ──────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<Match> getAll() {
        return matchRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Match getById(UUID id) {
        return matchRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Match introuvable : " + id));
    }

    public Match create(UUID competitionId, UUID equipeDomId, UUID equipeExtId, Match match) {
        Competition competition = competitionRepository.findById(competitionId)
                .orElseThrow(() -> new EntityNotFoundException("Compétition introuvable"));
        Equipe dom = equipeRepository.findById(equipeDomId)
                .orElseThrow(() -> new EntityNotFoundException("Équipe domicile introuvable"));
        Equipe ext = equipeRepository.findById(equipeExtId)
                .orElseThrow(() -> new EntityNotFoundException("Équipe extérieur introuvable"));

        if (equipeDomId.equals(equipeExtId))
            throw new IllegalArgumentException("Les deux équipes doivent être différentes");

        match.setCompetition(competition);
        match.setEquipeDomicile(dom);
        match.setEquipeExterieur(ext);
        // ✅ PLANIFIE par défaut à la création
        match.setStatut(MatchStatus.PLANIFIE);
        return matchRepository.save(match);
    }

    public Match update(UUID id, Match updated) {
        Match existing = getById(id);
        existing.setDateMatch(updated.getDateMatch());
        existing.setLieu(updated.getLieu());
        return matchRepository.save(existing);
    }

    public void delete(UUID id) {
        matchRepository.delete(getById(id));
    }

    // ── Statut ────────────────────────────────────────────

    public Match updateStatut(UUID id, MatchStatus statut) {
        Match match = getById(id);
        match.setStatut(statut);
        return matchRepository.save(match);
    }

    public Match commencer(UUID id) {
        return updateStatut(id, MatchStatus.EN_COURS);
    }

    public Match reporter(UUID id) {
        return updateStatut(id, MatchStatus.REPORTE);
    }

    public Match annuler(UUID id) {
        return updateStatut(id, MatchStatus.ANNULE);
    }

    // ── Résultat ──────────────────────────────────────────

    public Match enregistrerResultat(UUID id, Integer scoreDom, Integer scoreExt) {
        Match match = getById(id);

        if (match.getStatut() == MatchStatus.ANNULE)
            throw new IllegalStateException("Impossible d'enregistrer un résultat pour un match annulé");
        if (match.getStatut() == MatchStatus.REPORTE)
            throw new IllegalStateException("Impossible d'enregistrer un résultat pour un match reporté");

        match.setScoreDomicile(scoreDom);
        match.setScoreExterieur(scoreExt);
        // ✅ TERMINE après enregistrement du résultat
        match.setStatut(MatchStatus.TERMINE);
        return matchRepository.save(match);
    }

    // ── Filtres ───────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<Match> getByEquipe(UUID equipeId) {
        return matchRepository.findByEquipeDomicileIdOrEquipeExterieurId(equipeId, equipeId);
    }

    @Transactional(readOnly = true)
    public List<Match> getByCompetition(UUID competitionId) {
        return matchRepository.findByCompetitionId(competitionId);
    }

    @Transactional(readOnly = true)
    public List<Match> getByStatut(MatchStatus statut) {
        return matchRepository.findByStatut(statut);
    }

    // ── Stats ─────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Map<String, Long> getStats(UUID equipeId) {
        List<Match> matchs = getByEquipe(equipeId);

        long wins = matchs.stream()
                .filter(m -> m.getStatut() == MatchStatus.TERMINE && (
                        (m.getEquipeDomicile().getId().equals(equipeId) && m.getScoreDomicile() > m.getScoreExterieur()) ||
                                (m.getEquipeExterieur().getId().equals(equipeId) && m.getScoreExterieur() > m.getScoreDomicile())
                )).count();

        long losses = matchs.stream()
                .filter(m -> m.getStatut() == MatchStatus.TERMINE && (
                        (m.getEquipeDomicile().getId().equals(equipeId) && m.getScoreDomicile() < m.getScoreExterieur()) ||
                                (m.getEquipeExterieur().getId().equals(equipeId) && m.getScoreExterieur() < m.getScoreDomicile())
                )).count();

        long termines = matchs.stream()
                .filter(m -> m.getStatut() == MatchStatus.TERMINE).count();

        return Map.of(
                "total",     (long) matchs.size(),
                "termines",  termines,
                "wins",      wins,
                "losses",    losses,
                "draws",     termines - wins - losses,
                "planifies", matchs.stream().filter(m -> m.getStatut() == MatchStatus.PLANIFIE).count(),
                "enCours",   matchs.stream().filter(m -> m.getStatut() == MatchStatus.EN_COURS).count(),
                "reportes",  matchs.stream().filter(m -> m.getStatut() == MatchStatus.REPORTE).count()
        );
    }
}