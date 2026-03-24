package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.MatchRequest;
import com.example.pfegestionsportive.dto.response.MatchResponse;
import com.example.pfegestionsportive.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    // Public: Pour les Fans et tout le monde (Story 7.2)
    @GetMapping
    public ResponseEntity<List<MatchResponse>> getAllMatches() {
        return ResponseEntity.ok(matchService.getAllMatches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatchResponse> getMatchById(@PathVariable String id) {
        return ResponseEntity.ok(matchService.getMatchById(id));
    }

    // Admin Federation: Pour planifier les matchs (Story 7.1)
    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<MatchResponse> createMatch(@RequestBody @Valid MatchRequest req) {
        return ResponseEntity.ok(matchService.createMatch(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<MatchResponse> updateMatch(
            @PathVariable String id,
            @RequestBody MatchRequest req) {
        return ResponseEntity.ok(matchService.updateMatch(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<Void> deleteMatch(@PathVariable String id) {
        matchService.deleteMatch(id);
        return ResponseEntity.ok().build();
    }
}
