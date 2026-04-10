package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.AddJoueurRequest;
import com.example.pfegestionsportive.dto.request.AddStaffRequest;
import com.example.pfegestionsportive.dto.request.CreateEquipeRequest;
import com.example.pfegestionsportive.dto.request.PartenaireRequest;
import com.example.pfegestionsportive.dto.response.CalendarResponse;
import com.example.pfegestionsportive.dto.response.DashboardStatsResponse;
import com.example.pfegestionsportive.dto.response.MatchResponse;
import com.example.pfegestionsportive.dto.response.PartenaireResponse;
import com.example.pfegestionsportive.model.entity.Equipe;
import com.example.pfegestionsportive.model.entity.Joueur;
import com.example.pfegestionsportive.model.entity.StaffTechnique;
import com.example.pfegestionsportive.service.CalendarService;
import com.example.pfegestionsportive.service.ClubAdminService;
import com.example.pfegestionsportive.dto.response.JoueurAvecClubDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/club-admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('CLUB_ADMIN', 'FEDERATION_ADMIN', 'SUPER_ADMIN')")
public class ClubAdminController {

    private final ClubAdminService clubAdminService;
    private final CalendarService calendarService;

    // ─────────────────────────────────────────
    // --- Joueurs ---
    // ─────────────────────────────────────────

    @PostMapping("/joueurs")
    public ResponseEntity<Joueur> addJoueur(@RequestBody @Valid AddJoueurRequest request) {
        return ResponseEntity.ok(clubAdminService.addJoueur(request));
    }

    @GetMapping("/joueurs")
    public ResponseEntity<List<Joueur>> getMyJoueurs() {
        return ResponseEntity.ok(clubAdminService.getMyJoueurs());
    }

    @GetMapping("/joueurs/tous")
    @PreAuthorize("hasAnyRole('FEDERATION_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<JoueurAvecClubDTO>> getAllJoueursAvecClub() {
        return ResponseEntity.ok(clubAdminService
                .getAllJoueursAvecClub());
    }


    @PutMapping("/joueurs/{id}")
    public ResponseEntity<Joueur> updateJoueur(
            @PathVariable String id,
            @RequestBody @Valid AddJoueurRequest request) {
        return ResponseEntity.ok(clubAdminService.updateJoueur(id, request));
    }

    @DeleteMapping("/joueurs/{id}")
    public ResponseEntity<Void> deleteJoueur(@PathVariable String id) {
        clubAdminService.deleteJoueur(id);
        return ResponseEntity.noContent().build();
    }



    // ─────────────────────────────────────────
    // --- Activation joueurs inscrits ---
    // ─────────────────────────────────────────

    @GetMapping("/joueurs/en-attente")
    public ResponseEntity<List<Joueur>> getJoueursEnAttente() {
        return ResponseEntity.ok(clubAdminService.getJoueursEnAttente());
    }

    @PutMapping("/joueurs/{id}/accepter")
    @PreAuthorize("hasAnyRole('FEDERATION_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Joueur> accepterJoueur(@PathVariable String id) {
        return ResponseEntity.ok(clubAdminService.accepterJoueur(id));
    }

    @PutMapping("/joueurs/{id}/bloquer")
    @PreAuthorize("hasAnyRole('FEDERATION_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Joueur> bloquerJoueur(@PathVariable String id) {
        return ResponseEntity.ok(clubAdminService.bloquerJoueur(id));
    }


    // ─────────────────────────────────────────
    // --- Staff ---
    // ─────────────────────────────────────────

    @PostMapping("/staff")
    public ResponseEntity<StaffTechnique> addStaff(@RequestBody @Valid AddStaffRequest request) {
        return ResponseEntity.ok(clubAdminService.addStaff(request));
    }

    @GetMapping("/staff")
    public ResponseEntity<List<StaffTechnique>> getMyStaff() {
        return ResponseEntity.ok(clubAdminService.getMyStaff());
    }

    @PutMapping("/staff/{id}")
    public ResponseEntity<StaffTechnique> updateStaff(
            @PathVariable String id,
            @RequestBody @Valid AddStaffRequest request) {
        return ResponseEntity.ok(clubAdminService.updateStaff(id, request));
    }

    @DeleteMapping("/staff/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable String id) {
        clubAdminService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }

    // ─────────────────────────────────────────
    // --- Équipes ---
    // ─────────────────────────────────────────

    @PostMapping("/equipes")
    public ResponseEntity<Equipe> createEquipe(@RequestBody @Valid CreateEquipeRequest request) {
        return ResponseEntity.ok(clubAdminService.createEquipe(request));
    }

    @GetMapping("/equipes")
    public ResponseEntity<List<Equipe>> getMyEquipes() {
        return ResponseEntity.ok(clubAdminService.getMyEquipes());
    }

    @PutMapping("/equipes/{id}")
    public ResponseEntity<Equipe> updateEquipe(
            @PathVariable String id,
            @RequestBody @Valid CreateEquipeRequest request) {
        return ResponseEntity.ok(clubAdminService.updateEquipe(id, request));
    }

    @DeleteMapping("/equipes/{id}")
    public ResponseEntity<Void> deleteEquipe(@PathVariable String id) {
        clubAdminService.deleteEquipe(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/equipes/{equipeId}/joueurs/{joueurId}")
    public ResponseEntity<Equipe> addJoueurToEquipe(
            @PathVariable String equipeId,
            @PathVariable String joueurId) {
        return ResponseEntity.ok(clubAdminService.addJoueurToEquipe(equipeId, joueurId));
    }

    @DeleteMapping("/equipes/{equipeId}/joueurs/{joueurId}")
    public ResponseEntity<Equipe> removeJoueurFromEquipe(
            @PathVariable String equipeId,
            @PathVariable String joueurId) {
        return ResponseEntity.ok(clubAdminService.removeJoueurFromEquipe(equipeId, joueurId));
    }

    @GetMapping("/equipes/{equipeId}/matches")
    public ResponseEntity<List<MatchResponse>> getMatchesByEquipe(@PathVariable String equipeId) {
        return ResponseEntity.ok(clubAdminService.getMatchesByEquipe(equipeId));
    }

    // ─────────────────────────────────────────
    // --- Partenaires ---
    // ─────────────────────────────────────────

    @PostMapping("/partenaires")
    public ResponseEntity<PartenaireResponse> addPartenaire(@RequestBody @Valid PartenaireRequest request) {
        return ResponseEntity.ok(clubAdminService.addPartenaire(request));
    }

    @GetMapping("/partenaires")
    public ResponseEntity<List<PartenaireResponse>> getMyPartenaires() {
        return ResponseEntity.ok(clubAdminService.getMyPartenaires());
    }

    @PutMapping("/partenaires/{id}")
    public ResponseEntity<PartenaireResponse> updatePartenaire(
            @PathVariable String id,
            @RequestBody @Valid PartenaireRequest request) {
        return ResponseEntity.ok(clubAdminService.updatePartenaire(id, request));
    }

    @DeleteMapping("/partenaires/{id}")
    public ResponseEntity<Void> deletePartenaire(@PathVariable String id) {
        clubAdminService.deletePartenaire(id);
        return ResponseEntity.noContent().build();
    }
    // Partenaires fédéraux validés — visible lel club_admin
    @GetMapping("/partenaires/federation")
    public ResponseEntity<List<PartenaireResponse>> getPartenairesFederauxValides() {
        return ResponseEntity.ok(clubAdminService.getMyPartenaires());

    }

    // ─────────────────────────────────────────
    // --- Dashboard & Calendrier ---
    // ─────────────────────────────────────────

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(clubAdminService.getDashboardStats());
    }

    @GetMapping("/calendrier")
    public ResponseEntity<List<CalendarResponse>> getCalendar(Authentication auth) {
        return ResponseEntity.ok(calendarService.getCalendarForClubAdmin(auth.getName()));
    }
}