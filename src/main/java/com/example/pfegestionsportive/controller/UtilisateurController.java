package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.UpdateProfilDTO;
import com.example.pfegestionsportive.dto.UtilisateurDTO;
import com.example.pfegestionsportive.model.enums.Role;
import com.example.pfegestionsportive.service.UtilisateurService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    // SUPER_ADMIN : liste tous les utilisateurs
    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<UtilisateurDTO>> getAll() {
        return ResponseEntity.ok(utilisateurService.getAllUtilisateurs());
    }

    // SUPER_ADMIN : voir un utilisateur
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UtilisateurDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(utilisateurService.getById(id));
    }

    // Tous authentifiés : modifier son propre profil
    @PutMapping("/{id}/profil")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UtilisateurDTO> updateProfil(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProfilDTO dto) {
        return ResponseEntity.ok(utilisateurService.updateProfil(id, dto));
    }

    // SUPER_ADMIN : activer / désactiver
    @PatchMapping("/{id}/toggle-actif")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UtilisateurDTO> toggleActif(@PathVariable UUID id) {
        return ResponseEntity.ok(utilisateurService.toggleActif(id));
    }

    // SUPER_ADMIN : changer rôle
    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UtilisateurDTO> changerRole(
            @PathVariable UUID id,
            @RequestParam Role role) {
        return ResponseEntity.ok(utilisateurService.changerRole(id, role));
    }

    // SUPER_ADMIN : supprimer
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        utilisateurService.delete(id);
        return ResponseEntity.noContent().build();
    }
}