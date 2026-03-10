package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.model.entity.*;
import com.example.pfegestionsportive.model.enums.CompetitionCategory;
import com.example.pfegestionsportive.model.enums.CompetitionLevel;
import com.example.pfegestionsportive.service.CompetitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/competitions")
@RequiredArgsConstructor
public class CompetitionController {

    private final CompetitionService competitionService;

    @GetMapping
    public ResponseEntity<List<Competition>> getAll() {
        return ResponseEntity.ok(competitionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Competition> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(competitionService.getById(id));
    }

    @PostMapping("/federation/{federationId}")
    public ResponseEntity<Competition> create(@PathVariable UUID federationId,
                                              @RequestBody Competition competition) {
        return ResponseEntity.status(201).body(competitionService.create(federationId, competition));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Competition> update(@PathVariable UUID id,
                                              @RequestBody Competition competition) {
        return ResponseEntity.ok(competitionService.update(id, competition));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        competitionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/niveau/{niveau}")
    public ResponseEntity<List<Competition>> getByNiveau(@PathVariable CompetitionLevel niveau) {
        return ResponseEntity.ok(competitionService.getByNiveau(niveau));
    }

    @GetMapping("/categorie/{categorie}")
    public ResponseEntity<List<Competition>> getByCategorie(@PathVariable CompetitionCategory categorie) {
        return ResponseEntity.ok(competitionService.getByCategorie(categorie));
    }

    @GetMapping("/{id}/matchs")
    public ResponseEntity<List<Match>> getMatchs(@PathVariable UUID id) {
        return ResponseEntity.ok(competitionService.getMatchs(id));
    }

    @GetMapping("/{id}/licences")
    public ResponseEntity<List<Licence>> getLicences(@PathVariable UUID id) {
        return ResponseEntity.ok(competitionService.getLicences(id));
    }

    @GetMapping("/{id}/calendrier")
    public ResponseEntity<Calendrier> getCalendrier(@PathVariable UUID id) {
        return ResponseEntity.ok(competitionService.getCalendrier(id));
    }

    @PostMapping("/{id}/cloturer")
    public ResponseEntity<Competition> cloturerSaison(@PathVariable UUID id) {
        return ResponseEntity.ok(competitionService.cloturerSaison(id));
    }
}