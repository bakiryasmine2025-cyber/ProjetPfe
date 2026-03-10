package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.ClubDTO;
import com.example.pfegestionsportive.dto.request.SuspendreDTO;
import com.example.pfegestionsportive.service.ClubService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
public class ClubController {

    private final ClubService clubService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ClubDTO>> getAll() {
        return ResponseEntity.ok(clubService.getAll());
    }

    @GetMapping("/federation/{federationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ClubDTO>> getByFederation(
            @PathVariable UUID federationId) {
        return ResponseEntity.ok(clubService.getByFederation(federationId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ClubDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(clubService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<ClubDTO> create(
            @Valid @RequestBody ClubDTO dto) {
        return ResponseEntity.ok(clubService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<ClubDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody ClubDTO dto) {
        return ResponseEntity.ok(clubService.update(id, dto));
    }

    // ── Suspendre (US 3.1) ──
    @PatchMapping("/{id}/suspendre")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<ClubDTO> suspendre(
            @PathVariable UUID id,
            @Valid @RequestBody SuspendreDTO dto) {
        return ResponseEntity.ok(clubService.suspendre(id, dto));
    }

    // ── Activer ──
    @PatchMapping("/{id}/activer")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<ClubDTO> activer(@PathVariable UUID id) {
        return ResponseEntity.ok(clubService.activer(id));
    }

    // ── Désactiver ──
    @PatchMapping("/{id}/desactiver")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<ClubDTO> desactiver(@PathVariable UUID id) {
        return ResponseEntity.ok(clubService.desactiver(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        clubService.delete(id);
        return ResponseEntity.noContent().build();
    }
}