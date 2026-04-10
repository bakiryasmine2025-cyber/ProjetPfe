package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.response.CalendarResponse;
import com.example.pfegestionsportive.model.entity.Club;
import com.example.pfegestionsportive.model.entity.Match;
import com.example.pfegestionsportive.model.entity.Competition;
import com.example.pfegestionsportive.model.entity.User;
import com.example.pfegestionsportive.repository.ClubRepository;
import com.example.pfegestionsportive.repository.MatchRepository;
import com.example.pfegestionsportive.repository.CompetitionRepository;
import com.example.pfegestionsportive.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final MatchRepository matchRepository;
    private final CompetitionRepository competitionRepository;
    private final ClubRepository clubRepository;
    private final UserRepository userRepository;

    public List<CalendarResponse> getCalendarForClubAdmin(String adminEmail) {

        // 1. Récupérer l'admin avec son club (via club_id dans users)
        User admin = userRepository.findByEmailWithClub(adminEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // 2. Récupérer son club directement depuis le user (club_id)
        Club club = admin.getClub();
        if (club == null) {
            // Pas de club associé → retourner liste vide sans exception
            return new ArrayList<>();
        }

        // 3. Initialiser la liste result
        List<CalendarResponse> result = new ArrayList<>();

        // 4. Matchs du club
        List<Match> tousMatchs = matchRepository.findByClub(club.getId());
        tousMatchs.stream()
                .map(this::toMatchResponse)
                .forEach(result::add);

        // 5. Compétitions actives
        List<Competition> competitions = competitionRepository.findByActiveTrue();
        competitions.stream()
                .map(this::toCompetitionResponse)
                .forEach(result::add);

        // 6. Trier par date
        result.sort(Comparator.comparing(
                CalendarResponse::getDate,
                Comparator.nullsLast(Comparator.naturalOrder())
        ));

        return result;
    }

    private CalendarResponse toMatchResponse(Match m) {
        String domicile  = m.getEquipeDomicile()  != null ? m.getEquipeDomicile().getNom()  : "—";
        String exterieur = m.getEquipeExterieur() != null ? m.getEquipeExterieur().getNom() : "—";

        return CalendarResponse.builder()
                .id(m.getId())
                .type("MATCH")
                .title(domicile + " vs " + exterieur)
                .date(m.getDateMatch())
                .location(m.getLieu())
                .equipeDomicile(domicile)
                .equipeExterieur(exterieur)
                .scoreDomicile(m.getScoreDomicile())
                .scoreExterieur(m.getScoreExterieur())
                .statut(m.getStatut())
                .competitionNom(m.getCompetition() != null ? m.getCompetition().getNom() : null)
                .build();
    }

    private CalendarResponse toCompetitionResponse(Competition c) {
        return CalendarResponse.builder()
                .id(c.getId())
                .type("COMPETITION")
                .title(c.getNom())
                .date(c.getDateCreation())
                .description(c.getDescription())
                .competitionNom(c.getNom())
                .competitionCategorie(c.getCategorie() != null ? c.getCategorie().name() : null)
                .competitionNiveau(c.getNiveau()    != null ? c.getNiveau().name()    : null)
                .active(c.isActive())
                .build();
    }
}