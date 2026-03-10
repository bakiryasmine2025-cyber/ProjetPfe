package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.ClubDTO;
import com.example.pfegestionsportive.dto.ProfilArbitreDTO;
import com.example.pfegestionsportive.dto.ProfilStaffDTO;
import com.example.pfegestionsportive.service.ClubAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/club-admin")
@RequiredArgsConstructor
public class ClubAdminController {

    private final ClubAdminService clubAdminService;

    // User story 5.2 — Modifier infos club
    @PutMapping("/clubs/{clubId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<ClubDTO> modifierInfosClub(
            @PathVariable UUID clubId,
            @Valid @RequestBody ClubDTO dto) {
        return ResponseEntity.ok(clubAdminService.modifierInfosClub(clubId, dto));
    }

    // User story 5.1 — Staff
    @GetMapping("/clubs/{clubId}/staff")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<List<ProfilStaffDTO>> getStaff(@PathVariable UUID clubId) {
        return ResponseEntity.ok(clubAdminService.getStaffByClub(clubId));
    }

    @PostMapping("/staff")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<ProfilStaffDTO> ajouterStaff(
            @Valid @RequestBody ProfilStaffDTO dto) {
        return ResponseEntity.ok(clubAdminService.ajouterProfilStaff(dto));
    }

    @PutMapping("/staff/{profilId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<ProfilStaffDTO> modifierStaff(
            @PathVariable UUID profilId,
            @Valid @RequestBody ProfilStaffDTO dto) {
        return ResponseEntity.ok(clubAdminService.modifierProfilStaff(profilId, dto));
    }

    @DeleteMapping("/staff/{profilId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<Void> supprimerStaff(@PathVariable UUID profilId) {
        clubAdminService.supprimerProfilStaff(profilId);
        return ResponseEntity.noContent().build();
    }

    // User story 5.1 — Arbitres
    @GetMapping("/arbitres/disponibles")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<List<ProfilArbitreDTO>> getArbitresDisponibles() {
        return ResponseEntity.ok(clubAdminService.getArbitresDisponibles());
    }

    @PostMapping("/arbitres")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<ProfilArbitreDTO> ajouterArbitre(
            @Valid @RequestBody ProfilArbitreDTO dto) {
        return ResponseEntity.ok(clubAdminService.ajouterProfilArbitre(dto));
    }

    @PatchMapping("/arbitres/{profilId}/disponibilite")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<ProfilArbitreDTO> modifierDisponibilite(
            @PathVariable UUID profilId,
            @RequestParam Boolean disponibilite) {
        return ResponseEntity.ok(clubAdminService.modifierDisponibiliteArbitre(profilId, disponibilite));
    }
}