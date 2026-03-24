package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.CompetitionRequest;
import com.example.pfegestionsportive.dto.response.CompetitionResponse;
import com.example.pfegestionsportive.service.CompetitionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/federation/competitions")
@RequiredArgsConstructor
public class CompetitionController {

    private final CompetitionService competitionService;


    @GetMapping
    public ResponseEntity<List<CompetitionResponse>> getAll() {
        return ResponseEntity.ok(competitionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompetitionResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(competitionService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<CompetitionResponse> create(@RequestBody @Valid CompetitionRequest req) {
        return ResponseEntity.ok(competitionService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<CompetitionResponse> update(
            @PathVariable String id,
            @RequestBody CompetitionRequest req) {
        return ResponseEntity.ok(competitionService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        competitionService.delete(id);
        return ResponseEntity.ok().build();
    }


}
