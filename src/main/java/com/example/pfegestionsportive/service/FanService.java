package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.response.ActualiteResponse;
import com.example.pfegestionsportive.dto.response.FeedResponse;
import com.example.pfegestionsportive.dto.response.MatchResponse;
import com.example.pfegestionsportive.model.entity.Actualite;
import com.example.pfegestionsportive.model.entity.Club;
import com.example.pfegestionsportive.model.entity.Match;
import com.example.pfegestionsportive.model.entity.User;
import com.example.pfegestionsportive.model.enums.MatchStatus;
import com.example.pfegestionsportive.repository.ActualiteRepository;
import com.example.pfegestionsportive.repository.ClubRepository;
import com.example.pfegestionsportive.repository.MatchRepository;
import com.example.pfegestionsportive.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FanService {

    private final UserRepository userRepository;
    private final ClubRepository clubRepository;
    private final ActualiteRepository actualiteRepository;
    private final MatchRepository matchRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));
    }

    @Transactional
    public void followClub(String clubId) {
        User user = getCurrentUser();
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club non trouvé"));
        
        if (!user.getClubsSuivis().contains(club)) {
            user.getClubsSuivis().add(club);
            userRepository.save(user);
        }
    }

    @Transactional
    public void unfollowClub(String clubId) {
        User user = getCurrentUser();
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club non trouvé"));
        
        user.getClubsSuivis().remove(club);
        userRepository.save(user);
    }

    public FeedResponse getMyFeed() {
        User user = getCurrentUser();
        List<String> followedClubIds = user.getClubsSuivis().stream()
                .map(Club::getId)
                .collect(Collectors.toList());

        // Get news from followed clubs and federation
        List<Actualite> actualites = new ArrayList<>(actualiteRepository.findByClubIsNull());
        followedClubIds.forEach(id -> actualites.addAll(actualiteRepository.findByClubId(id)));

        // Get recent matches from followed clubs
        List<Match> matches = new ArrayList<>();
        followedClubIds.forEach(id -> matches.addAll(matchRepository.findByClubId(id)));

        // Sort and map
        List<ActualiteResponse> actualiteResponses = actualites.stream()
                .sorted(Comparator.comparing(Actualite::getDatePublication).reversed())
                .map(this::toActualiteResponse)
                .collect(Collectors.toList());

        List<MatchResponse> matchResponses = matches.stream()
                .filter(m -> m.getStatut() == MatchStatus.TERMINE)
                .sorted(Comparator.comparing(Match::getDateMatch).reversed())
                .limit(10) // Last 10 results
                .map(this::toMatchResponse)
                .collect(Collectors.toList());

        return FeedResponse.builder()
                .actualites(actualiteResponses)
                .derniersResultats(matchResponses)
                .build();
    }

    private ActualiteResponse toActualiteResponse(Actualite a) {
        return ActualiteResponse.builder()
                .id(a.getId())
                .titre(a.getTitre())
                .contenu(a.getContenu())
                .urlImage(a.getUrlImage())
                .datePublication(a.getDatePublication())
                .clubNom(a.getClub() != null ? a.getClub().getNom() : "Fédération")
                .build();
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
