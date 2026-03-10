package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.FederationDTO;
import com.example.pfegestionsportive.dto.request.SuspendreDTO;
import com.example.pfegestionsportive.model.entity.Federation;
import com.example.pfegestionsportive.model.enums.FederationStatus;
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
public class FederationService {

    private final FederationRepository federationRepository;

    // ─── Lire ─────────────────────────────────────────────────────────────────

    public List<FederationDTO> getAll() {
        return federationRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public FederationDTO getById(UUID id) {
        return federationRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Fédération non trouvée"
                ));
    }

    // ─── Créer ────────────────────────────────────────────────────────────────

    public FederationDTO create(FederationDTO dto) {
        if (federationRepository.existsByCode(dto.getCode())) {
            throw new IllegalStateException("Code fédération déjà utilisé");
        }

        Federation federation = Federation.builder()
                .nom(dto.getNom())
                .nomCourt(dto.getNomCourt())
                .pays(dto.getPays())
                .code(dto.getCode())
                .devise(dto.getDevise())
                .langueOfficielle(dto.getLangueOfficielle())
                .anneeFondation(dto.getAnneeFondation())
                .telephone(dto.getTelephone())
                .statut(FederationStatus.ACTIVE)
                .actif(true)
                .dateCreation(LocalDateTime.now())
                .dateMiseAJour(LocalDateTime.now())
                .build();

        return toDTO(federationRepository.save(federation));
    }

    // ─── Modifier ────────────────────────────────────────────────────────────

    public FederationDTO update(UUID id, FederationDTO dto) {
        Federation federation = federationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Fédération non trouvée"
                ));

        federation.setNom(dto.getNom());
        federation.setNomCourt(dto.getNomCourt());
        federation.setPays(dto.getPays());
        federation.setDevise(dto.getDevise());
        federation.setLangueOfficielle(dto.getLangueOfficielle());
        federation.setAnneeFondation(dto.getAnneeFondation());
        federation.setTelephone(dto.getTelephone());
        federation.setDateMiseAJour(LocalDateTime.now());

        return toDTO(federationRepository.save(federation));
    }

    // ─── User story 3.1 — Suspendre fédération ───────────────────────────────

    public FederationDTO suspendre(UUID id, SuspendreDTO dto) {
        Federation federation = federationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Fédération non trouvée"
                ));

        federation.suspendre(dto.getMotif());
        return toDTO(federationRepository.save(federation));
    }

    // ─── User story 3.1 — Activer fédération ─────────────────────────────────

    public FederationDTO activer(UUID id) {
        Federation federation = federationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Fédération non trouvée"
                ));

        federation.activer();
        return toDTO(federationRepository.save(federation));
    }

    // ─── Désactiver ───────────────────────────────────────────────────────────

    public FederationDTO desactiver(UUID id) {
        Federation federation = federationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Fédération non trouvée"
                ));

        federation.desactiver();
        return toDTO(federationRepository.save(federation));
    }

    // ─── Configurer paramètres (User story 3.2) ──────────────────────────────

    public FederationDTO configurerParametres(UUID id, FederationDTO dto) {
        Federation federation = federationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Fédération non trouvée"
                ));

        if (dto.getDevise() != null)
            federation.setDevise(dto.getDevise());
        if (dto.getLangueOfficielle() != null)
            federation.setLangueOfficielle(dto.getLangueOfficielle());
        if (dto.getTelephone() != null)
            federation.setTelephone(dto.getTelephone());

        federation.setDateMiseAJour(LocalDateTime.now());
        return toDTO(federationRepository.save(federation));
    }

    // ─── Supprimer ───────────────────────────────────────────────────────────

    public void delete(UUID id) {
        Federation federation = federationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Fédération non trouvée"
                ));

        if (federation.getStatut() == FederationStatus.ACTIVE) {
            throw new IllegalStateException(
                    "Suspendez la fédération avant de la supprimer"
            );
        }

        federationRepository.deleteById(id);
    }

    // ─── Mapper ──────────────────────────────────────────────────────────────

    private FederationDTO toDTO(Federation f) {
        return FederationDTO.builder()
                .id(f.getId())
                .nom(f.getNom())
                .nomCourt(f.getNomCourt())
                .pays(f.getPays())
                .code(f.getCode())
                .devise(f.getDevise())
                .langueOfficielle(f.getLangueOfficielle())
                .anneeFondation(f.getAnneeFondation())
                .telephone(f.getTelephone())
                .statut(f.getStatut())
                .actif(f.isActif())
                .motifSuspension(f.getMotifSuspension())
                .dateSuspension(f.getDateSuspension())
                .dateCreation(f.getDateCreation())
                .dateMiseAJour(f.getDateMiseAJour())
                .nombreClubs(f.getClubs() != null ? f.getClubs().size() : 0)
                .build();
    }
}