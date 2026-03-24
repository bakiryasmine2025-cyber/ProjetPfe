package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.response.ClubResponse;
import com.example.pfegestionsportive.dto.response.MatchResponse;
import com.example.pfegestionsportive.service.ClubService;
import com.example.pfegestionsportive.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final MatchService matchService;
    private final ClubService clubService;

    // 10.1: Visualiser les calendriers (et résultats)
    @GetMapping("/matches")
    public ResponseEntity<List<MatchResponse>> getAllMatches() {
        return ResponseEntity.ok(matchService.getAllMatches());
    }

    // 10.2: Découvrir les clubs
    @GetMapping("/clubs")
    public ResponseEntity<List<ClubResponse>> getAllClubs() {
        return ResponseEntity.ok(clubService.getAll());
    }

    @GetMapping("/clubs/{id}")
    public ResponseEntity<ClubResponse> getClubById(@PathVariable String id) {
        return ResponseEntity.ok(clubService.getById(id));
    }
}
