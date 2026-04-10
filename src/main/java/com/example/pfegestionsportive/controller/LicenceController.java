package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.LicenceRequest;
import com.example.pfegestionsportive.dto.response.LicenceResponse;
import com.example.pfegestionsportive.model.enums.LicenceStatus;
import com.example.pfegestionsportive.service.LicenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/licences")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"},
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
                RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS},
        allowedHeaders = "*",
        allowCredentials = "true")
public class LicenceController {

    private final LicenceService licenceService;

    @PostMapping
    @PreAuthorize("hasRole('CLUB_ADMIN')")
    public ResponseEntity<LicenceResponse> soumettreDemandeClub(@RequestBody LicenceRequest req) {
        return ResponseEntity.ok(licenceService.soumettreDemandeClub(req));
    }

    @GetMapping("/mon-club")
    @PreAuthorize("hasAnyRole('CLUB_ADMIN', 'FEDERATION_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<LicenceResponse>> getLicencesMonClub() {
        return ResponseEntity.ok(licenceService.getLicencesByClubAdmin());
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('FEDERATION_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<LicenceResponse> creerDirecte(@RequestBody LicenceRequest req) {
        return ResponseEntity.ok(licenceService.creerDirecte(req));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('FEDERATION_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<LicenceResponse>> getAllLicences() {
        return ResponseEntity.ok(licenceService.getAllLicences());
    }

    @GetMapping("/statut/{statut}")
    @PreAuthorize("hasAnyRole('FEDERATION_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<LicenceResponse>> getByStatut(@PathVariable LicenceStatus statut) {
        return ResponseEntity.ok(licenceService.getLicencesByStatut(statut));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('FEDERATION_ADMIN', 'CLUB_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<LicenceResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(licenceService.getLicenceById(id));
    }

    @PatchMapping("/{id}/approuver")
    @PreAuthorize("hasAnyRole('FEDERATION_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<LicenceResponse> approuver(@PathVariable String id) {
        return ResponseEntity.ok(licenceService.approuverLicence(id));
    }

    @PatchMapping("/{id}/activer")
    @PreAuthorize("hasAnyRole('FEDERATION_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<LicenceResponse> activer(@PathVariable String id) {
        return ResponseEntity.ok(licenceService.activerLicence(id));
    }

    @PatchMapping("/{id}/refuser")
    @PreAuthorize("hasAnyRole('FEDERATION_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<LicenceResponse> refuser(
            @PathVariable String id,
            @RequestParam(required = false) String motif) {
        return ResponseEntity.ok(licenceService.refuserLicence(id, motif));
    }

    @PatchMapping("/{id}/suspendre")
    @PreAuthorize("hasAnyRole('FEDERATION_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<LicenceResponse> suspendre(
            @PathVariable String id,
            @RequestParam(required = false) String raison) {
        return ResponseEntity.ok(licenceService.suspendreLicence(id, raison));
    }

    @PatchMapping("/{id}/renouveler")
    @PreAuthorize("hasAnyRole('FEDERATION_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<LicenceResponse> renouveler(@PathVariable String id) {
        return ResponseEntity.ok(licenceService.renouvelerLicence(id));
    }
}