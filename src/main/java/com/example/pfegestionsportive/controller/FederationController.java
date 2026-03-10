package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.FederationDTO;
import com.example.pfegestionsportive.dto.request.SuspendreDTO;
import com.example.pfegestionsportive.service.FederationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/federations")
@RequiredArgsConstructor
public class FederationController {

    private final FederationService federationService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<FederationDTO>> getAll() {
        return ResponseEntity.ok(federationService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FederationDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(federationService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<FederationDTO> create(
            @Valid @RequestBody FederationDTO dto) {
        return ResponseEntity.ok(federationService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<FederationDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody FederationDTO dto) {
        return ResponseEntity.ok(federationService.update(id, dto));
    }

    @PatchMapping("/{id}/parametres")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<FederationDTO> configurerParametres(
            @PathVariable UUID id,
            @RequestBody FederationDTO dto) {
        return ResponseEntity.ok(federationService.configurerParametres(id, dto));
    }

    // ── Suspendre (US 3.1) ──
    @PatchMapping("/{id}/suspendre")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<FederationDTO> suspendre(
            @PathVariable UUID id,
            @Valid @RequestBody SuspendreDTO dto) {
        return ResponseEntity.ok(federationService.suspendre(id, dto));
    }

    // ── Activer ──
    @PatchMapping("/{id}/activer")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<FederationDTO> activer(@PathVariable UUID id) {
        return ResponseEntity.ok(federationService.activer(id));
    }

    // ── Désactiver ──
    @PatchMapping("/{id}/desactiver")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<FederationDTO> desactiver(@PathVariable UUID id) {
        return ResponseEntity.ok(federationService.desactiver(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        federationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}