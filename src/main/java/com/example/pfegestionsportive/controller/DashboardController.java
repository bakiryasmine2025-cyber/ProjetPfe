package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.DashboardClubDTO;
import com.example.pfegestionsportive.dto.DashboardFederationDTO;
import com.example.pfegestionsportive.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    // User story 6.1 — Dashboard Fédération
    @GetMapping("/federation/{federationId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<DashboardFederationDTO> getDashboardFederation(
            @PathVariable UUID federationId) {
        return ResponseEntity.ok(dashboardService.getDashboardFederation(federationId));
    }

    // User story 6.1 — Dashboard Club
    @GetMapping("/club/{clubId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<DashboardClubDTO> getDashboardClub(
            @PathVariable UUID clubId) {
        return ResponseEntity.ok(dashboardService.getDashboardClub(clubId));
    }
}
