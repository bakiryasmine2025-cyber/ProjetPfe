package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.ClubRequest;
import com.example.pfegestionsportive.dto.request.ClubSuspensionRequest;
import com.example.pfegestionsportive.dto.response.ClubResponse;
import com.example.pfegestionsportive.service.ClubService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/federation/clubs")
@RequiredArgsConstructor
public class ClubController {

    private final ClubService clubService;

    @GetMapping
    public ResponseEntity<List<ClubResponse>> getAll() {
        return ResponseEntity.ok(clubService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClubResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(clubService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<ClubResponse> create(@RequestBody @Valid ClubRequest req) {
        return ResponseEntity.ok(clubService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<ClubResponse> update(
            @PathVariable String id, @RequestBody ClubRequest req) {
        return ResponseEntity.ok(clubService.update(id, req));
    }

    @PatchMapping("/{id}/statut")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<ClubResponse> changerStatut(
            @PathVariable String id,
            @RequestBody @Valid ClubSuspensionRequest req) {
        return ResponseEntity.ok(clubService.changerStatut(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        clubService.delete(id);
        return ResponseEntity.ok().build();
    }
}