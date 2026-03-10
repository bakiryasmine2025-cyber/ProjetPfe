package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.CalendrierDTO;
import com.example.pfegestionsportive.dto.MatchDTO;
import com.example.pfegestionsportive.model.enums.PlanningType;
import com.example.pfegestionsportive.service.CalendrierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/calendrier")
@RequiredArgsConstructor
public class CalendrierController {

    private final CalendrierService calendrierService;

    // User story 6.2 — Voir tous les calendriers
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CalendrierDTO>> getAll() {
        return ResponseEntity.ok(calendrierService.getAll());
    }

    // User story 6.2 — Voir par saison
    @GetMapping("/saison/{saison}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CalendrierDTO>> getBySaison(@PathVariable String saison) {
        return ResponseEntity.ok(calendrierService.getBySaison(saison));
    }

    // User story 6.2 — Voir par compétition
    @GetMapping("/competition/{competitionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CalendrierDTO> getByCompetition(@PathVariable UUID competitionId) {
        return ResponseEntity.ok(calendrierService.getByCompetition(competitionId));
    }

    // User story 6.2 — Voir matchs par club
    @GetMapping("/club/{clubId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<List<MatchDTO>> getMatchsParClub(
            @PathVariable UUID clubId,
            @RequestParam String saison) {
        return ResponseEntity.ok(calendrierService.getMatchsParClub(clubId, saison));
    }

    // Créer calendrier
    @PostMapping("/competition/{competitionId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<CalendrierDTO> creer(
            @PathVariable UUID competitionId,
            @RequestParam PlanningType typePlanning) {
        return ResponseEntity.ok(calendrierService.creerCalendrier(competitionId, typePlanning));
    }

    // Supprimer
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        calendrierService.delete(id);
        return ResponseEntity.noContent().build();
    }
}