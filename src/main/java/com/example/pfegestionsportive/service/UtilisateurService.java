package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.UpdateProfilDTO;
import com.example.pfegestionsportive.dto.UtilisateurDTO;
import com.example.pfegestionsportive.model.entity.Utilisateur;
import com.example.pfegestionsportive.model.enums.Role;
import com.example.pfegestionsportive.repository.UtilisateurRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    // ─── SUPER_ADMIN : liste tous les utilisateurs ───────────────────────────

    public List<UtilisateurDTO> getAllUtilisateurs() {
        return utilisateurRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ─── Voir un utilisateur par ID ──────────────────────────────────────────

    public UtilisateurDTO getById(UUID id) {
        return utilisateurRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));
    }

    // ─── Modifier son propre profil ──────────────────────────────────────────

    public UtilisateurDTO updateProfil(UUID id, UpdateProfilDTO dto) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));

        // Modifier email
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            if (utilisateurRepository.existsByEmail(dto.getEmail())
                    && !dto.getEmail().equals(utilisateur.getEmail())) {
                throw new IllegalStateException("Email déjà utilisé");
            }
            utilisateur.setEmail(dto.getEmail());
        }

        // Modifier téléphone
        if (dto.getTelephone() != null && !dto.getTelephone().isBlank()) {
            utilisateur.setTelephone(dto.getTelephone());
        }

        // Modifier mot de passe
        if (dto.getNouveauMotDePasse() != null && !dto.getNouveauMotDePasse().isBlank()) {
            if (dto.getAncienMotDePasse() == null ||
                    !passwordEncoder.matches(dto.getAncienMotDePasse(), utilisateur.getMotDePasseHash())) {
                throw new IllegalStateException("Ancien mot de passe incorrect");
            }
            utilisateur.setMotDePasseHash(passwordEncoder.encode(dto.getNouveauMotDePasse()));
        }

        return toDTO(utilisateurRepository.save(utilisateur));
    }

    // ─── SUPER_ADMIN : activer / désactiver un compte ────────────────────────

    public UtilisateurDTO toggleActif(UUID id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));
        utilisateur.setActif(!utilisateur.getActif());
        return toDTO(utilisateurRepository.save(utilisateur));
    }

    // ─── SUPER_ADMIN : changer le rôle ───────────────────────────────────────

    public UtilisateurDTO changerRole(UUID id, Role nouveauRole) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));
        utilisateur.setRole(nouveauRole.name());
        return toDTO(utilisateurRepository.save(utilisateur));
    }

    // ─── SUPER_ADMIN : supprimer un compte ───────────────────────────────────

    public void delete(UUID id) {
        if (!utilisateurRepository.existsById(id)) {
            throw new EntityNotFoundException("Utilisateur non trouvé");
        }
        utilisateurRepository.deleteById(id);
    }

    // ─── Mapper ──────────────────────────────────────────────────────────────

    private UtilisateurDTO toDTO(Utilisateur u) {
        return UtilisateurDTO.builder()
                .id(u.getId())
                .email(u.getEmail())
                .telephone(u.getTelephone())
                .role(Role.valueOf(u.getRole()))
                .actif(u.getActif())
                .derniereConnexion(u.getDerniereConnexion())
                .dateCreation(u.getDateCreation())
                .build();
    }
}