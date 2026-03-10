package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.ClubDTO;
import com.example.pfegestionsportive.dto.request.SuspendreDTO;
import com.example.pfegestionsportive.model.entity.Club;
import com.example.pfegestionsportive.model.entity.Federation;
import com.example.pfegestionsportive.model.enums.ClubStatus;
import com.example.pfegestionsportive.repository.ClubRepository;
import com.example.pfegestionsportive.repository.FederationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClubService {

    private final ClubRepository clubRepository;
    private final FederationRepository federationRepository;

    // ─── Lire ─────────────────────────────────────────────────────────────────

    public List<ClubDTO> getAll() {
        return clubRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ClubDTO> getByFederation(UUID federationId) {
        return clubRepository.findByFederationId(federationId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ClubDTO getById(UUID id) {
        return clubRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Club non trouvé"
                ));
    }

    // ─── Créer ────────────────────────────────────────────────────────────────

    public ClubDTO create(ClubDTO dto) {
        Federation federation = federationRepository
                .findById(dto.getFederationId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Fédération non trouvée"
                ));

        Club club = Club.builder()
                .nom(dto.getNom())
                .nomCourt(dto.getNomCourt())
                .ville(dto.getVille())
                .region(dto.getRegion())
                .anneeFondation(dto.getAnneeFondation())
                .urlLogo(dto.getUrlLogo())
                .statut(ClubStatus.ACTIF)
                .federation(federation)
                .dateCreation(LocalDateTime.now())
                .build();

        return toDTO(clubRepository.save(club));
    }

    // ─── Modifier ────────────────────────────────────────────────────────────

    public ClubDTO update(UUID id, ClubDTO dto) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Club non trouvé"
                ));

        club.setNom(dto.getNom());
        club.setNomCourt(dto.getNomCourt());
        club.setVille(dto.getVille());
        club.setRegion(dto.getRegion());
        club.setAnneeFondation(dto.getAnneeFondation());
        club.setUrlLogo(dto.getUrlLogo());

        return toDTO(clubRepository.save(club));
    }

    // ─── User story 3.1 — Suspendre club ─────────────────────────────────────

    public ClubDTO suspendre(UUID id, SuspendreDTO dto) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Club non trouvé"
                ));

        club.suspendre(dto.getMotif());
        return toDTO(clubRepository.save(club));
    }

    // ─── User story 3.1 — Activer club ───────────────────────────────────────

    public ClubDTO activer(UUID id) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Club non trouvé"
                ));

        club.activer();
        return toDTO(clubRepository.save(club));
    }

    // ─── Désactiver ───────────────────────────────────────────────────────────

    public ClubDTO desactiver(UUID id) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Club non trouvé"
                ));

        club.desactiver();
        return toDTO(clubRepository.save(club));
    }

    // ─── Supprimer ───────────────────────────────────────────────────────────

    public void delete(UUID id) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Club non trouvé"
                ));

        if (club.getStatut() == ClubStatus.ACTIF) {
            throw new IllegalStateException(
                    "Suspendez le club avant de le supprimer"
            );
        }

        clubRepository.deleteById(id);
    }

    // ─── Mapper ──────────────────────────────────────────────────────────────

    private ClubDTO toDTO(Club c) {
        return ClubDTO.builder()
                .id(c.getId())
                .nom(c.getNom())
                .nomCourt(c.getNomCourt())
                .ville(c.getVille())
                .region(c.getRegion())
                .anneeFondation(c.getAnneeFondation())
                .urlLogo(c.getUrlLogo())
                .statut(c.getStatut())
                .motifSuspension(c.getMotifSuspension())
                .dateSuspension(c.getDateSuspension())
                .dateCreation(c.getDateCreation())
                .federationId(c.getFederation() != null ?
                        c.getFederation().getId() : null)
                .nomFederation(c.getFederation() != null ?
                        c.getFederation().getNom() : null)
                .build();
    }
}