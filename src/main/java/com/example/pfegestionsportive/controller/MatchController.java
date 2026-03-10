package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.model.entity.Match;
import com.example.pfegestionsportive.model.enums.MatchStatus;
import com.example.pfegestionsportive.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/matchs")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    // ── CRUD ──────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<Match>> getAll() {
        return ResponseEntity.ok(matchService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Match> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(matchService.getById(id));
    }

    @PostMapping("/competition/{competitionId}")
    public ResponseEntity<Match> create(@PathVariable UUID competitionId,
                                        @RequestParam UUID equipeDomicileId,
                                        @RequestParam UUID equipeExterieurId,
                                        @RequestBody Match match) {
        return ResponseEntity.status(201).body(
                matchService.create(competitionId, equipeDomicileId, equipeExterieurId, match));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Match> update(@PathVariable UUID id,
                                        @RequestBody Match match) {
        return ResponseEntity.ok(matchService.update(id, match));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        matchService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ── Statut ────────────────────────────────────────────

    @PatchMapping("/{id}/statut")
    public ResponseEntity<Match> updateStatut(@PathVariable UUID id,
                                              @RequestParam MatchStatus statut) {
        return ResponseEntity.ok(matchService.updateStatut(id, statut));
    }

    @PatchMapping("/{id}/commencer")
    public ResponseEntity<Match> commencer(@PathVariable UUID id) {
        return ResponseEntity.ok(matchService.commencer(id));
    }

    @PatchMapping("/{id}/reporter")
    public ResponseEntity<Match> reporter(@PathVariable UUID id) {
        return ResponseEntity.ok(matchService.reporter(id));
    }

    @PatchMapping("/{id}/annuler")
    public ResponseEntity<Match> annuler(@PathVariable UUID id) {
        return ResponseEntity.ok(matchService.annuler(id));
    }

    // ── Résultat ──────────────────────────────────────────

    @PatchMapping("/{id}/resultat")
    public ResponseEntity<Match> enregistrerResultat(@PathVariable UUID id,
                                                     @RequestParam Integer scoreDomicile,
                                                     @RequestParam Integer scoreExterieur) {
        return ResponseEntity.ok(matchService.enregistrerResultat(id, scoreDomicile, scoreExterieur));
    }

    // ── Filtres ───────────────────────────────────────────

    @GetMapping("/equipe/{equipeId}")
    public ResponseEntity<List<Match>> getByEquipe(@PathVariable UUID equipeId) {
        return ResponseEntity.ok(matchService.getByEquipe(equipeId));
    }

    @GetMapping("/competition/{competitionId}")
    public ResponseEntity<List<Match>> getByCompetition(@PathVariable UUID competitionId) {
        return ResponseEntity.ok(matchService.getByCompetition(competitionId));
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Match>> getByStatut(@PathVariable MatchStatus statut) {
        return ResponseEntity.ok(matchService.getByStatut(statut));
    }

    // ── Stats ─────────────────────────────────────────────

    @GetMapping("/equipe/{equipeId}/stats")
    public ResponseEntity<Map<String, Long>> getStats(@PathVariable UUID equipeId) {
        return ResponseEntity.ok(matchService.getStats(equipeId));
    }
}