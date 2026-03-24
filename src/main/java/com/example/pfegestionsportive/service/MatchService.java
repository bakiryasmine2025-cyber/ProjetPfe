package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.MatchRequest;
import com.example.pfegestionsportive.dto.response.MatchResponse;
import com.example.pfegestionsportive.model.entity.*;
import com.example.pfegestionsportive.model.enums.MatchStatus;
import com.example.pfegestionsportive.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final CompetitionRepository competitionRepository;
    private final EquipeRepository equipeRepository;
    private final ArbitreRepository arbitreRepository;

    @Transactional(readOnly = true)
    public List<MatchResponse> getAllMatches() {
        return matchRepository.findAll().stream()
                .sorted(Comparator.comparing(Match::getDateMatch).reversed())
                .map(this::toMatchResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MatchResponse getMatchById(String id) {
        return matchRepository.findById(id)
                .map(this::toMatchResponse)
                .orElseThrow(() -> new RuntimeException("Match non trouvé"));
    }

    @Transactional
    public MatchResponse createMatch(MatchRequest req) {
        Competition competition = competitionRepository.findById(req.getCompetitionId())
                .orElseThrow(() -> new RuntimeException("Compétition non trouvée"));
        Equipe equipeDomicile = equipeRepository.findById(req.getEquipeDomicileId())
                .orElseThrow(() -> new RuntimeException("Équipe domicile non trouvée"));
        Equipe equipeExterieur = equipeRepository.findById(req.getEquipeExterieurId())
                .orElseThrow(() -> new RuntimeException("Équipe extérieure non trouvée"));
        Arbitre arbitre = req.getArbitreId() != null ? arbitreRepository.findById(req.getArbitreId())
                .orElseThrow(() -> new RuntimeException("Arbitre non trouvé")) : null;

        Match match = Match.builder()
                .competition(competition)
                .equipeDomicile(equipeDomicile)
                .equipeExterieur(equipeExterieur)
                .dateMatch(req.getDateMatch())
                .lieu(req.getLieu())
                .statut(req.getStatut() != null ? req.getStatut() : MatchStatus.PROGRAMME)
                .arbitre(arbitre)
                .build();

        return toMatchResponse(matchRepository.save(match));
    }

    @Transactional
    public MatchResponse updateMatch(String id, MatchRequest req) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match non trouvé"));

        // Update fields
        match.setDateMatch(req.getDateMatch());
        match.setLieu(req.getLieu());
        match.setScoreDomicile(req.getScoreDomicile());
        match.setScoreExterieur(req.getScoreExterieur());
        match.setStatut(req.getStatut());

        if (req.getArbitreId() != null) {
            Arbitre arbitre = arbitreRepository.findById(req.getArbitreId())
                    .orElseThrow(() -> new RuntimeException("Arbitre non trouvé"));
            match.setArbitre(arbitre);
        }

        return toMatchResponse(matchRepository.save(match));
    }

    @Transactional
    public void deleteMatch(String id) {
        matchRepository.deleteById(id);
    }

    private MatchResponse toMatchResponse(Match m) {
        return MatchResponse.builder()
                .id(m.getId())
                .competitionNom(m.getCompetition() != null ? m.getCompetition().getNom() : "Amical")
                .equipeDomicile(m.getEquipeDomicile() != null ? m.getEquipeDomicile().getNom() : "?")
                .equipeExterieur(m.getEquipeExterieur() != null ? m.getEquipeExterieur().getNom() : "?")
                .dateMatch(m.getDateMatch())
                .lieu(m.getLieu())
                .score(m.getStatut() == MatchStatus.TERMINE
                        ? (m.getScoreDomicile() != null ? m.getScoreDomicile() : 0) + " - " + (m.getScoreExterieur() != null ? m.getScoreExterieur() : 0)
                        : "N/A")
                .statut(m.getStatut().name())
                .build();
    }
}
