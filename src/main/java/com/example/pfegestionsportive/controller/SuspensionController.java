package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.LeverSuspensionRequest;
import com.example.pfegestionsportive.dto.SuspensionResponse;
import com.example.pfegestionsportive.dto.SuspensionRequest;
import com.example.pfegestionsportive.service.SuspensionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("api/v1")
@RequiredArgsConstructor
public class SuspensionController {

    private final SuspensionService suspensionService;

    // ─────────────────────────────────────────
    // 1. SUSPENDRE UN MEMBRE
    // PATCH /api/v1/licences/{id}/suspendre
    // ─────────────────────────────────────────
    @PatchMapping("/licences/{id}/suspendre")
    @PreAuthorize("hasRole('FEDERATION_ADMIN')")
    public ResponseEntity<SuspensionResponse> suspendreMembre(
            @PathVariable UUID id,
            @RequestBody SuspensionRequest request) {

        Long adminId = getAdminIdFromToken();
        SuspensionResponse response = suspensionService
                .suspendreMembre(id, request, adminId);
        return ResponseEntity.ok(response);
    }

    // ─────────────────────────────────────────
    // 2. LEVER UNE SUSPENSION
    // PATCH /api/v1/licences/{id}/lever-suspension
    // ─────────────────────────────────────────
    @PatchMapping("/licences/{id}/lever-suspension")
    @PreAuthorize("hasRole('FEDERATION_ADMIN')")
    public ResponseEntity<SuspensionResponse> leverSuspension(
            @PathVariable UUID id,
            @RequestBody LeverSuspensionRequest request) {

        Long adminId = getAdminIdFromToken();
        SuspensionResponse response = suspensionService
                .leverSuspension(id, request, adminId);
        return ResponseEntity.ok(response);
    }

    // ─────────────────────────────────────────
    // 3. HISTORIQUE DES SUSPENSIONS
    // GET /api/v1/membres/{id}/suspensions
    // ─────────────────────────────────────────
    @GetMapping("/membres/{id}/suspensions")
    @PreAuthorize("hasAnyRole('FEDERATION_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<Page<SuspensionResponse>> getHistorique(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<SuspensionResponse> historique = suspensionService
                .getHistoriqueSuspensions(id, page, size);
        return ResponseEntity.ok(historique);
    }

    // ─────────────────────────────────────────
    // HELPER : جيب adminId من الـ JWT token
    // ─────────────────────────────────────────
    private Long getAdminIdFromToken() {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();
        return Long.parseLong(auth.getName());
    }
}