package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.LicenceRequest;
import com.example.pfegestionsportive.dto.response.LicenceResponse;
import com.example.pfegestionsportive.service.LicenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LicenceController {

    private final LicenceService licenceService;

    @PostMapping("/federation/licences")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN' )")
    public ResponseEntity<LicenceResponse> createLicence(@RequestBody @Valid LicenceRequest req) {
        return ResponseEntity.ok(licenceService.createLicence(req));
    }

    @GetMapping("/federation/licences")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<List<LicenceResponse>> getAllLicences() {
        return ResponseEntity.ok(licenceService.getAllLicences());
    }

    @GetMapping("/federation/licences/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<LicenceResponse> getLicenceById(@PathVariable String id) {
        return ResponseEntity.ok(licenceService.getLicenceById(id));
    }

    @PutMapping("/federation/licences/{id}/verify")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<LicenceResponse> verifyLicence(@PathVariable String id) {
        return ResponseEntity.ok(licenceService.verifyLicence(id));
    }

    @PutMapping("/federation/licences/{id}/suspendre")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<LicenceResponse> suspendreLicence(
            @PathVariable String id,
            @RequestParam String raison) {
        return ResponseEntity.ok(licenceService.suspendreLicence(id, raison));
    }

    @GetMapping("/club-admin/licences")
    @PreAuthorize("hasRole('CLUB_ADMIN')")
    public ResponseEntity<List<LicenceResponse>> getMesLicences() {
        return ResponseEntity.ok(licenceService.getLicencesByClubAdmin());
    }

    @PostMapping("/club-admin/licences")
    @PreAuthorize("hasRole('CLUB_ADMIN')")
    public ResponseEntity<LicenceResponse> soumettredemande(
            @RequestBody @Valid LicenceRequest req) {
        return ResponseEntity.ok(licenceService.createLicence(req));

    }
}
