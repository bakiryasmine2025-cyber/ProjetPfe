package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.MatchRequest;
import com.example.pfegestionsportive.dto.request.MatchResultRequest;
import com.example.pfegestionsportive.dto.response.MatchResponse;
import com.example.pfegestionsportive.model.enums.MatchStatus;
import com.example.pfegestionsportive.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/federation/matchs")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @GetMapping
    public ResponseEntity<List<MatchResponse>> getAll() {
        return ResponseEntity.ok(matchService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatchResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(matchService.getById(id));
    }

    @GetMapping("/competition/{competitionId}")
    public ResponseEntity<List<MatchResponse>> getByCompetition(
            @PathVariable String competitionId) {
        return ResponseEntity.ok(matchService.getByCompetition(competitionId));
    }

    // ✅ 3.7 - Planifier match
    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<MatchResponse> planifier(@RequestBody @Valid MatchRequest req) {
        return ResponseEntity.ok(matchService.planifier(req));
    }

    // ✅ 3.8 - Enregistrer résultat
    @PatchMapping("/{id}/resultat")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<MatchResponse> enregistrerResultat(
            @PathVariable String id,
            @RequestBody @Valid MatchResultRequest req) {
        return ResponseEntity.ok(matchService.enregistrerResultat(id, req));
    }

    // Changer statut (REPORTE, ANNULE...)
    @PatchMapping("/{id}/statut")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<MatchResponse> changerStatut(
            @PathVariable String id,
            @RequestParam MatchStatus statut) {
        return ResponseEntity.ok(matchService.changerStatut(id, statut));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        matchService.delete(id);
        return ResponseEntity.ok().build();
    }
}