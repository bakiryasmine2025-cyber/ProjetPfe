package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.AddJoueurRequest;
import com.example.pfegestionsportive.model.entity.Joueur;
import com.example.pfegestionsportive.repository.JoueurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/joueurs")
@RequiredArgsConstructor
public class JoueurController {

    private final JoueurRepository joueurRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<List<Joueur>> getAllJoueurs() {
        return ResponseEntity.ok(joueurRepository.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<Joueur> getJoueurById(@PathVariable String id) {
        return joueurRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<Joueur> createJoueur(@RequestBody AddJoueurRequest request) {
        Joueur joueur = new Joueur();
        joueur.setNom(request.getNom());
        joueur.setPrenom(request.getPrenom());
        joueur.setDateNaissance(request.getDateNaissance());
        joueur.setGenre(request.getGenre());
        joueur.setTelephone(request.getTelephone());
        joueur.setEmail(request.getEmail());
        joueur.setPoste(request.getPoste());
        joueur.setCategorie(request.getCategorie());

        joueur.setCin(request.getCin());
        joueur.setNumeroLicence(request.getNumeroLicence());
        joueur.setCertificatMedical(request.getCertificatMedical() != null
                ? request.getCertificatMedical() : false);
        // ─────────────────────────────────────────────────────────────────
        return ResponseEntity.ok(joueurRepository.save(joueur));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<Joueur> updateJoueur(@PathVariable String id,
                                               @RequestBody AddJoueurRequest request) {
        return joueurRepository.findById(id).map(joueur -> {
            joueur.setNom(request.getNom());
            joueur.setPrenom(request.getPrenom());
            joueur.setDateNaissance(request.getDateNaissance());
            joueur.setGenre(request.getGenre());
            joueur.setTelephone(request.getTelephone());
            joueur.setEmail(request.getEmail());
            joueur.setPoste(request.getPoste());
            joueur.setCategorie(request.getCategorie());
            // ── champs obligatoires ajoutés ──────────────────────────────────
            joueur.setCin(request.getCin());
            joueur.setNumeroLicence(request.getNumeroLicence());
            joueur.setCertificatMedical(request.getCertificatMedical() != null
                    ? request.getCertificatMedical() : false);
            // ─────────────────────────────────────────────────────────────────
            return ResponseEntity.ok(joueurRepository.save(joueur));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<Void> deleteJoueur(@PathVariable String id) {
        if (!joueurRepository.existsById(id))
            return ResponseEntity.notFound().build();
        joueurRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}