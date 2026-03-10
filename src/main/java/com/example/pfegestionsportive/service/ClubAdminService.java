package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.ClubDTO;
import com.example.pfegestionsportive.dto.ProfilArbitreDTO;
import com.example.pfegestionsportive.dto.ProfilStaffDTO;
import com.example.pfegestionsportive.model.entity.*;
import com.example.pfegestionsportive.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClubAdminService {

    private final ClubRepository clubRepository;
    private final PersonneRepository personneRepository;
    private final ProfilStaffRepository profilStaffRepository;
    private final ProfilArbitreRepository profilArbitreRepository;

    // ─── User story 5.2 — Modifier infos club ────────────────────────────────

    public ClubDTO modifierInfosClub(UUID clubId, ClubDTO dto) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new EntityNotFoundException("Club non trouvé"));

        club.setNom(dto.getNom());
        club.setNomCourt(dto.getNomCourt());
        club.setVille(dto.getVille());
        club.setRegion(dto.getRegion());
        club.setAnneeFondation(dto.getAnneeFondation());
        club.setUrlLogo(dto.getUrlLogo());

        Club saved = clubRepository.save(club);

        return ClubDTO.builder()
                .id(saved.getId())
                .nom(saved.getNom())
                .nomCourt(saved.getNomCourt())
                .ville(saved.getVille())
                .region(saved.getRegion())
                .anneeFondation(saved.getAnneeFondation())
                .urlLogo(saved.getUrlLogo())
                .statut(saved.getStatut())
                .federationId(saved.getFederation() != null ? saved.getFederation().getId() : null)
                .nomFederation(saved.getFederation() != null ? saved.getFederation().getNom() : null)
                .build();
    }

    // ─── User story 5.1 — Gérer profil staff ─────────────────────────────────

    public ProfilStaffDTO ajouterProfilStaff(ProfilStaffDTO dto) {
        Personne personne = personneRepository.findById(dto.getPersonneId())
                .orElseThrow(() -> new EntityNotFoundException("Personne non trouvée"));

        if (profilStaffRepository.existsByPersonneId(dto.getPersonneId())) {
            throw new IllegalStateException("Cette personne a déjà un profil staff");
        }

        ProfilStaff profilStaff = ProfilStaff.builder()
                .typeStaff(dto.getTypeStaff())
                .qualification(dto.getQualification())
                .anneesExperience(dto.getAnneesExperience())
                .personne(personne)
                .build();

        return toStaffDTO(profilStaffRepository.save(profilStaff));
    }

    public ProfilStaffDTO modifierProfilStaff(UUID profilId, ProfilStaffDTO dto) {
        ProfilStaff profilStaff = profilStaffRepository.findById(profilId)
                .orElseThrow(() -> new EntityNotFoundException("Profil staff non trouvé"));

        profilStaff.setTypeStaff(dto.getTypeStaff());
        profilStaff.setQualification(dto.getQualification());
        profilStaff.setAnneesExperience(dto.getAnneesExperience());

        return toStaffDTO(profilStaffRepository.save(profilStaff));
    }

    public void supprimerProfilStaff(UUID profilId) {
        if (!profilStaffRepository.existsById(profilId)) {
            throw new EntityNotFoundException("Profil staff non trouvé");
        }
        profilStaffRepository.deleteById(profilId);
    }

    public List<ProfilStaffDTO> getStaffByClub(UUID clubId) {
        return personneRepository.findStaffByClubId(clubId)
                .stream()
                .filter(p -> p.getProfilStaff() != null)
                .map(p -> toStaffDTO(p.getProfilStaff()))
                .collect(Collectors.toList());
    }

    // ─── User story 5.1 — Gérer profil arbitre ───────────────────────────────

    public ProfilArbitreDTO ajouterProfilArbitre(ProfilArbitreDTO dto) {
        Personne personne = personneRepository.findById(dto.getPersonneId())
                .orElseThrow(() -> new EntityNotFoundException("Personne non trouvée"));

        if (profilArbitreRepository.existsByPersonneId(dto.getPersonneId())) {
            throw new IllegalStateException("Cette personne a déjà un profil arbitre");
        }

        ProfilArbitre profilArbitre = ProfilArbitre.builder()
                .niveau(dto.getNiveau())
                .certificationDate(dto.getCertificationDate())
                .disponibilite(dto.getDisponibilite())
                .personne(personne)
                .build();

        return toArbitreDTO(profilArbitreRepository.save(profilArbitre));
    }

    public ProfilArbitreDTO modifierDisponibiliteArbitre(UUID profilId, Boolean disponibilite) {
        ProfilArbitre profilArbitre = profilArbitreRepository.findById(profilId)
                .orElseThrow(() -> new EntityNotFoundException("Profil arbitre non trouvé"));

        profilArbitre.mettreAJourDisponibilite(disponibilite);
        return toArbitreDTO(profilArbitreRepository.save(profilArbitre));
    }

    public List<ProfilArbitreDTO> getArbitresDisponibles() {
        return profilArbitreRepository.findByDisponibilite(true)
                .stream().map(this::toArbitreDTO).collect(Collectors.toList());
    }

    // ─── Mappers ──────────────────────────────────────────────────────────────

    private ProfilStaffDTO toStaffDTO(ProfilStaff s) {
        return ProfilStaffDTO.builder()
                .id(s.getId())
                .personneId(s.getPersonne().getId())
                .nomPersonne(s.getPersonne().getNom())
                .prenomPersonne(s.getPersonne().getPrenom())
                .typeStaff(s.getTypeStaff())
                .qualification(s.getQualification())
                .anneesExperience(s.getAnneesExperience())
                .build();
    }

    private ProfilArbitreDTO toArbitreDTO(ProfilArbitre a) {
        return ProfilArbitreDTO.builder()
                .id(a.getId())
                .personneId(a.getPersonne().getId())
                .nomPersonne(a.getPersonne().getNom())
                .prenomPersonne(a.getPersonne().getPrenom())
                .niveau(a.getNiveau())
                .certificationDate(a.getCertificationDate())
                .disponibilite(a.getDisponibilite())
                .build();
    }
}