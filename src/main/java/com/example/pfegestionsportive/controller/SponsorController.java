package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.SponsorDTO;
import com.example.pfegestionsportive.service.SponsorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sponsors")
@RequiredArgsConstructor
public class SponsorController {

    private final SponsorService sponsorService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SponsorDTO>> getAll() {
        return ResponseEntity.ok(sponsorService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SponsorDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(sponsorService.getById(id));
    }

    @GetMapping("/federation/{federationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SponsorDTO>> getByFederation(
            @PathVariable UUID federationId) {
        return ResponseEntity.ok(sponsorService.getByFederation(federationId));
    }

    @GetMapping("/club/{clubId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SponsorDTO>> getByClub(
            @PathVariable UUID clubId) {
        return ResponseEntity.ok(sponsorService.getByClub(clubId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<SponsorDTO> create(
            @Valid @RequestBody SponsorDTO dto) {
        return ResponseEntity.ok(sponsorService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<SponsorDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody SponsorDTO dto) {
        return ResponseEntity.ok(sponsorService.update(id, dto));
    }

    @PatchMapping("/{id}/toggle-actif")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<SponsorDTO> toggleActif(@PathVariable UUID id) {
        return ResponseEntity.ok(sponsorService.toggleActif(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        sponsorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}