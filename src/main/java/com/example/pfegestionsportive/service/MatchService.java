package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.MatchRequest;
import com.example.pfegestionsportive.dto.request.MatchResultRequest;
import com.example.pfegestionsportive.dto.response.MatchResponse;
import com.example.pfegestionsportive.model.entity.*;
import com.example.pfegestionsportive.model.enums.MatchStatus;
import com.example.pfegestionsportive.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository       matchRepository;
    private final CompetitionRepository competitionRepository;
    private final EquipeRepository      equipeRepository;
    private final ArbitreRepository     arbitreRepository;

    public MatchResponse planifier(MatchRequest req) {
        Competition competition = competitionRepository.findById(req.getCompetitionId())
                .orElseThrow(() -> new RuntimeException("Compétition introuvable"));

        Equipe domicile = equipeRepository.findById(req.getEquipeDomicileId())
                .orElseThrow(() -> new RuntimeException("Équipe domicile introuvable"));

        Equipe exterieur = equipeRepository.findById(req.getEquipeExterieurId())
                .orElseThrow(() -> new RuntimeException("Équipe extérieure introuvable"));

        if (domicile.getId().equals(exterieur.getId()))
            throw new RuntimeException("Les deux équipes doivent être différentes");

        LocalDateTime debut = req.getDateMatch().minusHours(2);
        LocalDateTime fin   = req.getDateMatch().plusHours(2);

        List<Match> conflitsDomicile = matchRepository.findConflits(domicile.getId(), debut, fin);
        if (!conflitsDomicile.isEmpty())
            throw new RuntimeException("Conflit calendrier pour l'équipe domicile : " +
                    conflitsDomicile.get(0).getDateMatch());

        List<Match> conflitsExterieur = matchRepository.findConflits(exterieur.getId(), debut, fin);
        if (!conflitsExterieur.isEmpty())
            throw new RuntimeException("Conflit calendrier pour l'équipe extérieure : " +
                    conflitsExterieur.get(0).getDateMatch());

        Arbitre arbitre = null;
        if (req.getArbitreId() != null && !req.getArbitreId().isBlank())
            arbitre = arbitreRepository.findById(req.getArbitreId()).orElse(null);

        Match match = Match.builder()
                .competition(competition)
                .equipeDomicile(domicile)
                .equipeExterieur(exterieur)
                .arbitre(arbitre)
                .dateMatch(req.getDateMatch())
                .lieu(req.getLieu())
                .statut(MatchStatus.PROGRAMME)
                .build();

        return toResponse(matchRepository.save(match));
    }

    // ── UPDATE ──────────────────────────────────────────────────────────────
    public MatchResponse update(String id, MatchRequest req) {
        Match match = findById(id);

        if (req.getCompetitionId() != null && !req.getCompetitionId().isBlank()) {
            Competition competition = competitionRepository.findById(req.getCompetitionId())
                    .orElseThrow(() -> new RuntimeException("Compétition introuvable"));
            match.setCompetition(competition);
        }
        if (req.getEquipeDomicileId() != null && !req.getEquipeDomicileId().isBlank()) {
            Equipe domicile = equipeRepository.findById(req.getEquipeDomicileId())
                    .orElseThrow(() -> new RuntimeException("Équipe domicile introuvable"));
            match.setEquipeDomicile(domicile);
        }
        if (req.getEquipeExterieurId() != null && !req.getEquipeExterieurId().isBlank()) {
            Equipe exterieur = equipeRepository.findById(req.getEquipeExterieurId())
                    .orElseThrow(() -> new RuntimeException("Équipe extérieure introuvable"));
            match.setEquipeExterieur(exterieur);
        }
        if (req.getDateMatch() != null)      match.setDateMatch(req.getDateMatch());
        if (req.getLieu() != null)           match.setLieu(req.getLieu());
        if (req.getStatut() != null)         match.setStatut(req.getStatut());
        if (req.getScoreDomicile() != null)  match.setScoreDomicile(req.getScoreDomicile());
        if (req.getScoreExterieur() != null) match.setScoreExterieur(req.getScoreExterieur());
        if (req.getArbitreId() != null && !req.getArbitreId().isBlank())
            arbitreRepository.findById(req.getArbitreId()).ifPresent(match::setArbitre);

        return toResponse(matchRepository.save(match));
    }

    public List<MatchResponse> getAll() {
        return matchRepository.findAllByOrderByDateMatchAsc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<MatchResponse> getByCompetition(String competitionId) {
        return matchRepository.findByCompetitionIdOrderByDateMatchAsc(competitionId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public MatchResponse getById(String id) {
        return toResponse(findById(id));
    }

    public MatchResponse enregistrerResultat(String id, MatchResultRequest req) {
        Match match = findById(id);
        if (match.getStatut() == MatchStatus.REPORTE)
            throw new RuntimeException("Impossible de modifier un match reporté");
        match.setScoreDomicile(req.getScoreDomicile());
        match.setScoreExterieur(req.getScoreExterieur());
        match.setStatut(MatchStatus.TERMINE);
        return toResponse(matchRepository.save(match));
    }

    public MatchResponse changerStatut(String id, MatchStatus statut) {
        Match match = findById(id);
        match.setStatut(statut);
        return toResponse(matchRepository.save(match));
    }

    public void delete(String id) {
        matchRepository.delete(findById(id));
    }

    private Match findById(String id) {
        return matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match introuvable"));
    }

    private MatchResponse toResponse(Match m) {
        return MatchResponse.builder()
                .id(m.getId())
                .competitionId(m.getCompetition().getId())
                .competitionNom(m.getCompetition().getNom())
                .equipeDomicileId(m.getEquipeDomicile().getId())
                .equipeDomicileNom(m.getEquipeDomicile().getNom())
                .equipeExterieureId(m.getEquipeExterieur().getId())
                .equipeExterieureNom(m.getEquipeExterieur().getNom())
                .arbitreId(m.getArbitre() != null ? m.getArbitre().getId() : null)
                .arbitreNom(m.getArbitre() != null
                        ? m.getArbitre().getNom() + " " + m.getArbitre().getPrenom() : null)
                .dateMatch(m.getDateMatch())
                .lieu(m.getLieu())
                .scoreDomicile(m.getScoreDomicile())
                .scoreExterieur(m.getScoreExterieur())
                .statut(m.getStatut().name())
                .build();
    }
}