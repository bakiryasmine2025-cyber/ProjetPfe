package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.PersonneDTO;
import com.example.pfegestionsportive.service.PersonneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/personnes")
@RequiredArgsConstructor
public class PersonneController {

    private final PersonneService personneService;

    // Tous par club
    @GetMapping("/club/{clubId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<List<PersonneDTO>> getByClub(@PathVariable UUID clubId) {
        return ResponseEntity.ok(personneService.getByClub(clubId));
    }

    // User story 5.1 — Joueurs
    @GetMapping("/club/{clubId}/joueurs")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<List<PersonneDTO>> getJoueurs(@PathVariable UUID clubId) {
        return ResponseEntity.ok(personneService.getJoueursByClub(clubId));
    }

    // User story 5.1 — Entraîneurs
    @GetMapping("/club/{clubId}/entraineurs")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<List<PersonneDTO>> getEntraineurs(@PathVariable UUID clubId) {
        return ResponseEntity.ok(personneService.getEntraineursByClub(clubId));
    }

    // User story 5.1 — Staff
    @GetMapping("/club/{clubId}/staff")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<List<PersonneDTO>> getStaff(@PathVariable UUID clubId) {
        return ResponseEntity.ok(personneService.getStaffByClub(clubId));
    }

    // Voir une personne
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<PersonneDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(personneService.getById(id));
    }

    // User story 5.1 — Créer
    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<PersonneDTO> create(@Valid @RequestBody PersonneDTO dto) {
        return ResponseEntity.ok(personneService.create(dto));
    }

    // User story 5.1 — Modifier
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<PersonneDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody PersonneDTO dto) {
        return ResponseEntity.ok(personneService.update(id, dto));
    }

    // Supprimer
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        personneService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
