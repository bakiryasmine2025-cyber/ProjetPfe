package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.DemandeDTO;
import com.example.pfegestionsportive.dto.LicenceDTO;
import com.example.pfegestionsportive.model.entity.Club;
import com.example.pfegestionsportive.model.entity.Licence;
import com.example.pfegestionsportive.model.entity.Personne;
import com.example.pfegestionsportive.model.enums.LicenseStatus;
import com.example.pfegestionsportive.repository.ClubRepository;
import com.example.pfegestionsportive.repository.LicenceRepository;
import com.example.pfegestionsportive.repository.PersonneRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LicenceService {

    private final LicenceRepository licenceRepository;
    private final PersonneRepository personneRepository;
    private final ClubRepository clubRepository;

    // ─── Lire ─────────────────────────────────────────────────────────────────

    public List<LicenceDTO> getAll() {
        return licenceRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public LicenceDTO getById(UUID id) {
        return licenceRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new EntityNotFoundException("Licence non trouvée"));
    }

    public List<LicenceDTO> getByClub(UUID clubId) {
        return licenceRepository.findByClubId(clubId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<LicenceDTO> getByStatut(LicenseStatus statut) {
        return licenceRepository.findByStatut(statut)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<LicenceDTO> getByPersonne(UUID personneId) {
        return licenceRepository.findByPersonneId(personneId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ─── User story 4.2 — Soumettre demande de licence (Club Admin) ───────────

    public LicenceDTO soumettreDemandeeLicence(DemandeDTO dto) {
        Personne personne = personneRepository.findById(dto.getPersonneId())
                .orElseThrow(() -> new EntityNotFoundException("Personne non trouvée"));
        Club club = clubRepository.findById(dto.getClubId())
                .orElseThrow(() -> new EntityNotFoundException("Club non trouvé"));

        // Vérifier si déjà une licence active
        if (licenceRepository.existsByPersonneIdAndStatut(dto.getPersonneId(), LicenseStatus.ACTIVE)) {
            throw new IllegalStateException("Cette personne possède déjà une licence active");
        }

        Licence licence = Licence.builder()
                .numero(genererNumero())
                .type(dto.getType())
                .dateEmission(LocalDate.now())
                .dateExpiration(LocalDate.now().plusYears(1))
                .statut(LicenseStatus.EN_ATTENTE)
                .aptitudeMedicale(dto.getAptitudeMedicale())
                .personne(personne)
                .club(club)
                .build();

        return toDTO(licenceRepository.save(licence));
    }

    // ─── User story 4.1 / 4.3 — Valider une licence (Fédération Admin) ────────

    public LicenceDTO validerLicence(UUID id) {
        Licence licence = licenceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Licence non trouvée"));

        if (licence.getStatut() != LicenseStatus.EN_ATTENTE) {
            throw new IllegalStateException("Seules les licences EN_ATTENTE peuvent être validées");
        }

        licence.activerLicence();
        return toDTO(licenceRepository.save(licence));
    }

    // ─── User story 4.3 — Refuser une licence ────────────────────────────────

    public LicenceDTO refuserLicence(UUID id, String motif) {
        Licence licence = licenceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Licence non trouvée"));

        licence.setStatut(LicenseStatus.REFUSEE);
        licence.setMotifSuspension(motif);
        return toDTO(licenceRepository.save(licence));
    }

    // ─── User story 4.2 — Suspendre un membre ────────────────────────────────

    public LicenceDTO suspendreMemb(UUID id, String motif) {
        Licence licence = licenceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Licence non trouvée"));

        if (licence.getStatut() != LicenseStatus.ACTIVE) {
            throw new IllegalStateException("Seules les licences ACTIVE peuvent être suspendues");
        }

        licence.setStatut(LicenseStatus.SUSPENDUE);
        licence.setMotifSuspension(motif);
        return toDTO(licenceRepository.save(licence));
    }

    // ─── Réactiver une licence suspendue ──────────────────────────────────────

    public LicenceDTO reactiverLicence(UUID id) {
        Licence licence = licenceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Licence non trouvée"));

        if (licence.getStatut() != LicenseStatus.SUSPENDUE) {
            throw new IllegalStateException("Seules les licences SUSPENDUES peuvent être réactivées");
        }

        licence.setStatut(LicenseStatus.ACTIVE);
        licence.setMotifSuspension(null);
        return toDTO(licenceRepository.save(licence));
    }

    // ─── Renouveler une licence ───────────────────────────────────────────────

    public LicenceDTO renouvelerLicence(UUID id) {
        Licence licence = licenceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Licence non trouvée"));

        licence.renouveler(LocalDate.now().plusYears(1));
        return toDTO(licenceRepository.save(licence));
    }

    // ─── Vérifier licences expirées (batch) ───────────────────────────────────

    public void verifierLicencesExpirees() {
        List<Licence> expirees = licenceRepository.findLicencesExpirees(LocalDate.now());
        expirees.forEach(l -> {
            l.setStatut(LicenseStatus.EXPIREE);
            licenceRepository.save(l);
        });
    }

    // ─── Supprimer ────────────────────────────────────────────────────────────

    public void delete(UUID id) {
        if (!licenceRepository.existsById(id)) {
            throw new EntityNotFoundException("Licence non trouvée");
        }
        licenceRepository.deleteById(id);
    }

    // ─── Générateur numéro unique ─────────────────────────────────────────────

    private String genererNumero() {
        return "LIC-" + LocalDate.now().getYear() + "-"
                + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    // ─── Mapper ───────────────────────────────────────────────────────────────

    private LicenceDTO toDTO(Licence l) {
        return LicenceDTO.builder()
                .id(l.getId())
                .numero(l.getNumero())
                .type(l.getType())
                .dateEmission(l.getDateEmission())
                .dateExpiration(l.getDateExpiration())
                .statut(l.getStatut())
                .aptitudeMedicale(l.getAptitudeMedicale())
                .motifSuspension(l.getMotifSuspension())
                .personneId(l.getPersonne() != null ? l.getPersonne().getId() : null)
                .nomPersonne(l.getPersonne() != null ? l.getPersonne().getNom() : null)
                .prenomPersonne(l.getPersonne() != null ? l.getPersonne().getPrenom() : null)
                .clubId(l.getClub() != null ? l.getClub().getId() : null)
                .nomClub(l.getClub() != null ? l.getClub().getNom() : null)
                .build();
    }
}