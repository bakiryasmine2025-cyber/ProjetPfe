package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.CreateMatchRequest;
import com.example.pfegestionsportive.dto.request.FederationRequest;
import com.example.pfegestionsportive.dto.request.PartenaireRequest;
import com.example.pfegestionsportive.dto.request.MatchRequest;
import com.example.pfegestionsportive.dto.request.SendMessageRequest;
import com.example.pfegestionsportive.dto.response.CalendarResponse;
import com.example.pfegestionsportive.dto.response.FederationResponse;
import com.example.pfegestionsportive.dto.response.JoueurAvecClubDTO;
import com.example.pfegestionsportive.dto.response.MatchResponse;
import com.example.pfegestionsportive.dto.response.MessageResponse;
import com.example.pfegestionsportive.dto.response.PartenaireResponse;
import com.example.pfegestionsportive.model.entity.*;
import com.example.pfegestionsportive.model.enums.AccountStatus;
import com.example.pfegestionsportive.model.enums.EquipeStatut;
import com.example.pfegestionsportive.model.enums.MatchStatus;
import com.example.pfegestionsportive.model.enums.Role;
import com.example.pfegestionsportive.repository.*;
import com.example.pfegestionsportive.service.AuthService;
import com.example.pfegestionsportive.service.CalendarService;
import com.example.pfegestionsportive.service.ClubAdminService;
import com.example.pfegestionsportive.service.FederationService;
import com.example.pfegestionsportive.repository.PartenaireRepository;
import com.example.pfegestionsportive.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/federation")
@RequiredArgsConstructor
public class FederationController {

    private final FederationService federationService;
    private final CalendarService calendarService;
    private final ClubAdminService clubAdminService;
    private final EquipeRepository equipeRepository;
    private final MatchRepository matchRepository;
    private final CompetitionRepository competitionRepository;
    private final JoueurRepository joueurRepository;
    private final ClubRepository clubRepository;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final JdbcTemplate jdbcTemplate;
    private final PartenaireRepository partenaireRepository;
    private final UserService userService;

    // ═══════════════════════════════════════════════
    // FÉDÉRATION — paramètres
    // ═══════════════════════════════════════════════

    @GetMapping("/parametres")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<FederationResponse> get() {
        return ResponseEntity.ok(federationService.get());
    }

    @PutMapping("/parametres")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<FederationResponse> update(@RequestBody @Valid FederationRequest req) {
        return ResponseEntity.ok(federationService.update(req));
    }

    @GetMapping("/clubs/{clubId}/joueurs")
    public ResponseEntity<List<Joueur>> getJoueursByClub(@PathVariable String clubId) {
        return ResponseEntity.ok(joueurRepository.findByClubId(clubId));
    }

    // ═══════════════════════════════════════════════
    // MESSAGES — pour la fédération
    // ═══════════════════════════════════════════════

    // Récupérer les messages reçus par la fédération
    @GetMapping("/messages")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<List<MessageResponse>> getMyMessages(Authentication auth) {
        return ResponseEntity.ok(userService.getMyMessages(auth.getName()));
    }

    // Compter les messages non lus
    @GetMapping("/messages/unread-count")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<Long> countUnread(Authentication auth) {
        return ResponseEntity.ok(userService.countUnread(auth.getName()));
    }

    // Marquer un message comme lu
    @PutMapping("/messages/{id}/read")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<Void> markAsRead(@PathVariable String id) {
        userService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    // Envoyer un message depuis la fédération vers quelqu'un
    @PostMapping("/messages")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<MessageResponse> sendMessage(
            Authentication auth,
            @RequestBody @Valid SendMessageRequest req) {
        return ResponseEntity.ok(userService.sendMessage(auth.getName(), req));
    }

    // ═══════════════════════════════════════════════
    // CLUB ADMINS — demandes en attente
    // ═══════════════════════════════════════════════

    @GetMapping("/club-admins/en-attente")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<List<User>> getClubAdminsEnAttente() {
        return ResponseEntity.ok(
                userRepository.findByRoleAndStatut(Role.CLUB_ADMIN, AccountStatus.PENDING_APPROVAL)
        );
    }

    @PutMapping("/club-admins/{id}/accepter")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<String> accepterClubAdmin(@PathVariable String id) {
        return ResponseEntity.ok(authService.approveClubAdmin(id));
    }

    @PutMapping("/club-admins/{id}/refuser")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<String> refuserClubAdmin(
            @PathVariable String id,
            @RequestParam(defaultValue = "Demande refusée") String reason) {
        return ResponseEntity.ok(authService.rejectRegistration(id, reason));
    }


    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUtilisateurs", userRepository.count());
        stats.put("demandesEnAttente", userRepository
                .findByRoleAndStatut(Role.CLUB_ADMIN, AccountStatus.PENDING_APPROVAL).size());
        stats.put("totalClubs",        clubRepository.count());
        stats.put("totalCompetitions", competitionRepository.count());
        stats.put("totalJoueurs",      joueurRepository.count());
        stats.put("totalEquipes",      equipeRepository.count());
        stats.put("totalMatchs",       matchRepository.count());
        stats.put("totalPartenaires",  partenaireRepository.count());
        return ResponseEntity.ok(stats);
    }

    // ═══════════════════════════════════════════════
    // JOUEURS
    // ═══════════════════════════════════════════════

    @GetMapping("/joueurs")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<List<JoueurAvecClubDTO>> getAllJoueurs() {
        String sql = """
            SELECT
                p.id, p.nom, p.prenom, p.genre, p.telephone,
                j.poste, j.categorie, j.statut,
                p.club_id, c.nom AS club_nom
            FROM joueurs j
            JOIN personnes p ON j.id = p.id
            LEFT JOIN clubs c ON p.club_id = c.id
            """;

        List<JoueurAvecClubDTO> joueurs = jdbcTemplate.query(sql, (rs, rowNum) ->
                JoueurAvecClubDTO.builder()
                        .id(rs.getString("id"))
                        .nom(rs.getString("nom"))
                        .prenom(rs.getString("prenom"))
                        .genre(rs.getString("genre") != null
                                ? com.example.pfegestionsportive.model.enums.Gender.valueOf(rs.getString("genre"))
                                : null)
                        .poste(rs.getString("poste"))
                        .categorie(rs.getString("categorie"))
                        .telephone(rs.getString("telephone"))
                        .statut(rs.getString("statut"))
                        .clubId(rs.getString("club_id"))
                        .clubNom(rs.getString("club_nom") != null ? rs.getString("club_nom") : "Sans club")
                        .build()
        );

        return ResponseEntity.ok(joueurs);
    }

    @PutMapping("/joueurs/{id}/accepter")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<Joueur> accepterJoueur(@PathVariable String id) {
        Joueur joueur = joueurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Joueur introuvable"));
        joueur.setStatut("ACCEPTE");
        return ResponseEntity.ok(joueurRepository.save(joueur));
    }

    @PutMapping("/joueurs/{id}/bloquer")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<Joueur> bloquerJoueur(@PathVariable String id) {
        Joueur joueur = joueurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Joueur introuvable"));
        joueur.setStatut("BLOQUE");
        return ResponseEntity.ok(joueurRepository.save(joueur));
    }

    // ═══════════════════════════════════════════════
    // ÉQUIPES — federation view + validation
    // ═══════════════════════════════════════════════

    @GetMapping("/equipes")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<List<Equipe>> getAllEquipes() {
        return ResponseEntity.ok(equipeRepository.findAll());
    }

    @PutMapping("/equipes/{id}/valider")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<Equipe> validerEquipe(@PathVariable String id) {
        Equipe equipe = equipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Équipe introuvable"));
        equipe.setStatut(EquipeStatut.VALIDEE);
        return ResponseEntity.ok(equipeRepository.save(equipe));
    }

    @PutMapping("/equipes/{id}/bloquer")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<Equipe> bloquerEquipe(@PathVariable String id) {
        Equipe equipe = equipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Équipe introuvable"));
        equipe.setStatut(EquipeStatut.BLOQUEE);
        return ResponseEntity.ok(equipeRepository.save(equipe));
    }


    @PutMapping("/equipes/{id}/inscrire/{competitionId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<Equipe> inscrireCompetition(
            @PathVariable String id,
            @PathVariable String competitionId) {
        Equipe equipe = equipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Équipe introuvable"));
        Competition competition = competitionRepository.findById(competitionId)
                .orElseThrow(() -> new RuntimeException("Compétition introuvable"));
        equipe.setCompetition(competition);
        return ResponseEntity.ok(equipeRepository.save(equipe));
    }


    @DeleteMapping("/equipes/{id}/competition")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<Equipe> desinscrireCompetition(@PathVariable String id) {
        Equipe equipe = equipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Équipe introuvable"));
        equipe.setCompetition(null);
        return ResponseEntity.ok(equipeRepository.save(equipe));
    }



    @GetMapping("/calendrier")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<List<CalendarResponse>> getCalendar(Authentication auth) {
        return ResponseEntity.ok(calendarService.getCalendarForClubAdmin(auth.getName()));
    }



    @GetMapping("/matches")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<List<Match>> getAllMatches() {
        return ResponseEntity.ok(matchRepository.findAllByOrderByDateMatchAsc());
    }

    @PostMapping("/matches")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<MatchResponse> createMatch(@RequestBody @Valid CreateMatchRequest req) {
        Equipe domicile = equipeRepository.findById(req.getEquipeDomicileId())
                .orElseThrow(() -> new RuntimeException("Équipe domicile introuvable"));
        Equipe exterieur = equipeRepository.findById(req.getEquipeExterieurId())
                .orElseThrow(() -> new RuntimeException("Équipe extérieur introuvable"));
        Competition competition = null;
        if (req.getCompetitionId() != null && !req.getCompetitionId().isBlank()) {
            competition = competitionRepository.findById(req.getCompetitionId()).orElse(null);
        }
        Match match = Match.builder()
                .equipeDomicile(domicile)
                .equipeExterieur(exterieur)
                .dateMatch(req.getDateMatch())
                .lieu(req.getLieu())
                .competition(competition)
                .statut(MatchStatus.PROGRAMME)
                .build();
        return ResponseEntity.ok(toMatchResponse(matchRepository.save(match)));
    }

    @PutMapping("/matches/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<MatchResponse> updateMatch(
            @PathVariable String id,
            @RequestBody @Valid MatchRequest req) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match introuvable"));
        if (req.getDateMatch() != null) match.setDateMatch(req.getDateMatch());
        if (req.getLieu() != null)      match.setLieu(req.getLieu());
        if (req.getCompetitionId() != null && !req.getCompetitionId().isBlank()) {
            match.setCompetition(competitionRepository.findById(req.getCompetitionId()).orElse(null));
        }
        return ResponseEntity.ok(toMatchResponse(matchRepository.save(match)));
    }

    @PutMapping("/matches/{id}/reprogrammer")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<MatchResponse> reprogrammerMatch(
            @PathVariable String id,
            @RequestBody @Valid MatchRequest req) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match introuvable"));
        if (req.getDateMatch() != null) match.setDateMatch(req.getDateMatch());
        if (req.getLieu() != null)      match.setLieu(req.getLieu());
        match.setStatut(MatchStatus.REPORTE);
        return ResponseEntity.ok(toMatchResponse(matchRepository.save(match)));
    }

    @DeleteMapping("/matches/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<Void> deleteMatch(@PathVariable String id) {
        matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match introuvable"));
        matchRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ═══════════════════════════════════════════════
    // PARTENAIRES FÉDÉRAUX
    // ═══════════════════════════════════════════════

    @GetMapping("/partenaires")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<List<PartenaireResponse>> getPartenaires() {
        return ResponseEntity.ok(federationService.getPartenaires());
    }

    @PostMapping("/partenaires")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<PartenaireResponse> addPartenaire(@RequestBody @Valid PartenaireRequest request) {
        return ResponseEntity.ok(federationService.addPartenaire(request));
    }

    @PutMapping("/partenaires/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<PartenaireResponse> updatePartenaire(
            @PathVariable String id, @RequestBody @Valid PartenaireRequest request) {
        return ResponseEntity.ok(federationService.updatePartenaire(id, request));
    }

    @DeleteMapping("/partenaires/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<Void> deletePartenaire(@PathVariable String id) {
        federationService.deletePartenaire(id);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/partenaires/{id}/valider")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<Partenaire> validerPartenaire(@PathVariable String id) {
        Partenaire p = partenaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partenaire introuvable"));
        p.setStatut(com.example.pfegestionsportive.model.enums.PartenaireStatut.VALIDE);
        return ResponseEntity.ok(partenaireRepository.save(p));
    }

    @PutMapping("/partenaires/{id}/refuser")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<Partenaire> refuserPartenaire(@PathVariable String id) {
        Partenaire p = partenaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partenaire introuvable"));
        p.setStatut(com.example.pfegestionsportive.model.enums.PartenaireStatut.REFUSE);
        return ResponseEntity.ok(partenaireRepository.save(p));
    }

    private MatchResponse toMatchResponse(Match m) {
        return MatchResponse.builder()
                .id(m.getId())
                .competitionNom(m.getCompetition() != null ? m.getCompetition().getNom() : "Amical")
                .equipeDomicileNom(m.getEquipeDomicile() != null ? m.getEquipeDomicile().getNom() : "—")
                .equipeExterieureNom(m.getEquipeExterieur() != null ? m.getEquipeExterieur().getNom() : "—")
                .dateMatch(m.getDateMatch())
                .lieu(m.getLieu())
                .scoreDomicile(m.getScoreDomicile())
                .scoreExterieur(m.getScoreExterieur())
                .statut(m.getStatut().name())
                .build();
    }
}