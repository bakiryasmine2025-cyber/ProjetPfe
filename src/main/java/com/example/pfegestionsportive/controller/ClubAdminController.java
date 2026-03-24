package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.AddJoueurRequest;
import com.example.pfegestionsportive.dto.request.AddStaffRequest;
import com.example.pfegestionsportive.dto.request.CreateEquipeRequest;
import com.example.pfegestionsportive.dto.request.PartenaireRequest;
import com.example.pfegestionsportive.dto.response.DashboardStatsResponse;
import com.example.pfegestionsportive.dto.response.MatchResponse;
import com.example.pfegestionsportive.dto.response.PartenaireResponse;
import com.example.pfegestionsportive.model.entity.Equipe;
import com.example.pfegestionsportive.model.entity.Joueur;
import com.example.pfegestionsportive.model.entity.StaffTechnique;
import com.example.pfegestionsportive.service.ClubAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/club-admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('CLUB_ADMIN', 'FEDERATION_ADMIN', 'SUPER_ADMIN')")
public class ClubAdminController {

    private final ClubAdminService clubAdminService;

    // --- Sprint 5 & 8 ---
    @PostMapping("/joueurs")
    public ResponseEntity<Joueur> addJoueur(@RequestBody @Valid AddJoueurRequest request) {
        return ResponseEntity.ok(clubAdminService.addJoueur(request));
    }

    @GetMapping("/joueurs")
    public ResponseEntity<List<Joueur>> getMyJoueurs() {
        return ResponseEntity.ok(clubAdminService.getMyJoueurs());
    }

    @PostMapping("/staff")
    public ResponseEntity<StaffTechnique> addStaff(@RequestBody @Valid AddStaffRequest request) {
        return ResponseEntity.ok(clubAdminService.addStaff(request));
    }

    @GetMapping("/staff")
    public ResponseEntity<List<StaffTechnique>> getMyStaff() {
        return ResponseEntity.ok(clubAdminService.getMyStaff());
    }

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

    // --- Sprint 6 ---
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

    // 6.1: Tableau de bord
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(clubAdminService.getDashboardStats());
    }

    // 6.2: Calendrier
    @GetMapping("/calendrier")
    public ResponseEntity<List<MatchResponse>> getMyCalendar() {
        return ResponseEntity.ok(clubAdminService.getMyCalendar());
    }

    // --- Sprint 8 ---
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

    // 8.2: Suivre les résultats par équipe
    @GetMapping("/equipes/{equipeId}/matches")
    public ResponseEntity<List<MatchResponse>> getMatchesByEquipe(@PathVariable String equipeId) {
        return ResponseEntity.ok(clubAdminService.getMatchesByEquipe(equipeId));
    }
}