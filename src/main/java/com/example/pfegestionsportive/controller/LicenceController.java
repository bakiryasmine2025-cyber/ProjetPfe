package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.DemandeDTO;
import com.example.pfegestionsportive.dto.LicenceDTO;
import com.example.pfegestionsportive.model.enums.LicenseStatus;
import com.example.pfegestionsportive.service.LicenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/licences")
@RequiredArgsConstructor
public class LicenceController {

    private final LicenceService licenceService;

    // Voir toutes les licences
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<List<LicenceDTO>> getAll() {
        return ResponseEntity.ok(licenceService.getAll());
    }

    // Voir une licence
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<LicenceDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(licenceService.getById(id));
    }

    // Licences par club
    @GetMapping("/club/{clubId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<List<LicenceDTO>> getByClub(@PathVariable UUID clubId) {
        return ResponseEntity.ok(licenceService.getByClub(clubId));
    }

    // Licences par statut
    @GetMapping("/statut/{statut}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<List<LicenceDTO>> getByStatut(@PathVariable LicenseStatus statut) {
        return ResponseEntity.ok(licenceService.getByStatut(statut));
    }

    // Licences par personne
    @GetMapping("/personne/{personneId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<List<LicenceDTO>> getByPersonne(@PathVariable UUID personneId) {
        return ResponseEntity.ok(licenceService.getByPersonne(personneId));
    }

    // User story 4.2 — Club Admin soumet demande
    @PostMapping("/demande")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<LicenceDTO> soumettreDemande(@Valid @RequestBody DemandeDTO dto) {
        return ResponseEntity.ok(licenceService.soumettreDemandeeLicence(dto));
    }

    // User story 4.1 / 4.3 — Fédération valide
    @PatchMapping("/{id}/valider")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<LicenceDTO> valider(@PathVariable UUID id) {
        return ResponseEntity.ok(licenceService.validerLicence(id));
    }

    // User story 4.3 — Fédération refuse
    @PatchMapping("/{id}/refuser")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<LicenceDTO> refuser(
            @PathVariable UUID id,
            @RequestParam String motif) {
        return ResponseEntity.ok(licenceService.refuserLicence(id, motif));
    }

    // User story 4.2 — Fédération suspend membre
    @PatchMapping("/{id}/suspendre")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<LicenceDTO> suspendre(
            @PathVariable UUID id,
            @RequestParam String motif) {
        return ResponseEntity.ok(licenceService.suspendreMemb(id, motif));
    }

    // Réactiver licence suspendue
    @PatchMapping("/{id}/reactiver")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<LicenceDTO> reactiver(@PathVariable UUID id) {
        return ResponseEntity.ok(licenceService.reactiverLicence(id));
    }

    // Renouveler licence
    @PatchMapping("/{id}/renouveler")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<LicenceDTO> renouveler(@PathVariable UUID id) {
        return ResponseEntity.ok(licenceService.renouvelerLicence(id));
    }

    // Supprimer
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        licenceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}