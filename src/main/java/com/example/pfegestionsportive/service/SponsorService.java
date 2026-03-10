package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.SponsorDTO;
import com.example.pfegestionsportive.model.entity.Club;
import com.example.pfegestionsportive.model.entity.Federation;
import com.example.pfegestionsportive.model.entity.Sponsor;
import com.example.pfegestionsportive.repository.ClubRepository;
import com.example.pfegestionsportive.repository.FederationRepository;
import com.example.pfegestionsportive.repository.SponsorRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SponsorService {

    private final SponsorRepository sponsorRepository;
    private final FederationRepository federationRepository;
    private final ClubRepository clubRepository;

    // ─── Lire ─────────────────────────────────────────────────────────────────

    public List<SponsorDTO> getAll() {
        return sponsorRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public SponsorDTO getById(UUID id) {
        return sponsorRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Sponsor non trouvé"
                ));
    }

    public List<SponsorDTO> getByFederation(UUID federationId) {
        return sponsorRepository.findByFederationId(federationId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<SponsorDTO> getByClub(UUID clubId) {
        return sponsorRepository.findByClubId(clubId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ─── Créer ────────────────────────────────────────────────────────────────

    public SponsorDTO create(SponsorDTO dto) {
        Federation federation = null;
        if (dto.getFederationId() != null) {
            federation = federationRepository.findById(dto.getFederationId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Fédération non trouvée"
                    ));
        }

        Club club = null;
        if (dto.getClubId() != null) {
            club = clubRepository.findById(dto.getClubId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Club non trouvé"
                    ));
        }

        Sponsor sponsor = Sponsor.builder()
                .nom(dto.getNom())
                .contact(dto.getContact())
                .email(dto.getEmail())
                .telephone(dto.getTelephone())
                .urlLogo(dto.getUrlLogo())
                .montantContrat(dto.getMontantContrat())
                .dateDebut(dto.getDateDebut())
                .dateFin(dto.getDateFin())
                .actif(true)
                .dateCreation(LocalDateTime.now())
                .federation(federation)
                .club(club)
                .build();

        return toDTO(sponsorRepository.save(sponsor));
    }

    // ─── Modifier ────────────────────────────────────────────────────────────

    public SponsorDTO update(UUID id, SponsorDTO dto) {
        Sponsor sponsor = sponsorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Sponsor non trouvé"
                ));

        sponsor.setNom(dto.getNom());
        sponsor.setContact(dto.getContact());
        sponsor.setEmail(dto.getEmail());
        sponsor.setTelephone(dto.getTelephone());
        sponsor.setUrlLogo(dto.getUrlLogo());
        sponsor.setMontantContrat(dto.getMontantContrat());
        sponsor.setDateDebut(dto.getDateDebut());
        sponsor.setDateFin(dto.getDateFin());

        return toDTO(sponsorRepository.save(sponsor));
    }

    // ─── Activer/Désactiver ───────────────────────────────────────────────────

    public SponsorDTO toggleActif(UUID id) {
        Sponsor sponsor = sponsorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Sponsor non trouvé"
                ));
        sponsor.setActif(!sponsor.isActif());
        return toDTO(sponsorRepository.save(sponsor));
    }

    // ─── Supprimer ───────────────────────────────────────────────────────────

    public void delete(UUID id) {
        if (!sponsorRepository.existsById(id)) {
            throw new EntityNotFoundException("Sponsor non trouvé");
        }
        sponsorRepository.deleteById(id);
    }

    // ─── Mapper ──────────────────────────────────────────────────────────────

    private SponsorDTO toDTO(Sponsor s) {
        return SponsorDTO.builder()
                .id(s.getId())
                .nom(s.getNom())
                .contact(s.getContact())
                .email(s.getEmail())
                .telephone(s.getTelephone())
                .urlLogo(s.getUrlLogo())
                .montantContrat(s.getMontantContrat())
                .dateDebut(s.getDateDebut())
                .dateFin(s.getDateFin())
                .actif(s.isActif())
                .dateCreation(s.getDateCreation())
                .federationId(s.getFederation() != null ?
                        s.getFederation().getId() : null)
                .nomFederation(s.getFederation() != null ?
                        s.getFederation().getNom() : null)
                .clubId(s.getClub() != null ?
                        s.getClub().getId() : null)
                .nomClub(s.getClub() != null ?
                        s.getClub().getNom() : null)
                .build();
    }
}