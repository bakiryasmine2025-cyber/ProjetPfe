package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.LeverSuspensionRequest;
import com.example.pfegestionsportive.dto.SuspensionRequest;
import com.example.pfegestionsportive.dto.SuspensionResponse;
import com.example.pfegestionsportive.exception.AlreadySuspendreException;
import com.example.pfegestionsportive.exception.ResourceNotFoundException;
import com.example.pfegestionsportive.model.*;
import com.example.pfegestionsportive.repository.LicenceRepository;
import com.example.pfegestionsportive.repository.SuspensionRepository;
import com.example.pfegestionsportive.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SuspensionService {

    private final LicenceRepository licenceRepository;
    private final SuspensionRepository suspensionRepository;
    private final UserRepository userRepository;

    // ─────────────────────────────────────────
    // 1. SUSPENDRE UN MEMBRE
    // ─────────────────────────────────────────
    @Transactional
    public SuspensionResponse suspendreMembre(UUID licenceId,
                                              SuspensionRequest request,
                                              Long adminId) {
        Licence licence = licenceRepository.findById(licenceId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Licence introuvable avec id : " + licenceId));

        if (licence.getStatut() == LicenseStatus.SUSPENDED ||
                licence.getStatut() == LicenseStatus.REVOKED) {
            throw new AlreadySuspendreException("Ce membre est déjà suspendu");
        }

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Admin introuvable avec id : " + adminId));

        Suspension suspension = Suspension.builder()
                .licence(licence)
                .membre(licence.getMembre())
                .typeSuspension(request.getTypeSuspension())
                .statut(StatutSuspension.ACTIVE)
                .motif(request.getMotif())
                .dateDebut(request.getDateDebut())
                .dateFin(request.getDateFin())
                .creePar(admin)
                .build();

        suspensionRepository.save(suspension);

        if (request.getTypeSuspension() == TypeSuspension.DEFINITIVE) {
            licence.setStatut(LicenseStatus.REVOKED);
            User membre = licence.getMembre();
            membre.setActif(false);
            userRepository.save(membre);
        } else {
            licence.setStatut(LicenseStatus.SUSPENDED);
        }

        licenceRepository.save(licence);
        return mapToResponse(suspension);
    }

    // ─────────────────────────────────────────
    // 2. LEVER UNE SUSPENSION
    // ─────────────────────────────────────────
    @Transactional
    public SuspensionResponse leverSuspension(UUID licenceId,
                                              LeverSuspensionRequest request,
                                              Long adminId) {
        Licence licence = licenceRepository.findById(licenceId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Licence introuvable avec id : " + licenceId));

        if (licence.getStatut() != LicenseStatus.SUSPENDED &&
                licence.getStatut() != LicenseStatus.REVOKED) {
            throw new ResourceNotFoundException("Ce membre n'est pas suspendu");
        }

        Suspension suspension = suspensionRepository
                .findByLicenceIdAndStatut(licenceId, StatutSuspension.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Aucune suspension active trouvée"));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Admin introuvable avec id : " + adminId));

        suspension.setStatut(StatutSuspension.LIFTED);
        suspension.setRaisonLevee(request.getRaisonLevee());
        suspension.setDateLevee(LocalDateTime.now());
        suspension.setLevePar(admin);
        suspensionRepository.save(suspension);

        licence.setStatut(LicenseStatus.ACTIVE);
        licenceRepository.save(licence);

        User membre = licence.getMembre();
        membre.setActif(true);
        userRepository.save(membre);

        return mapToResponse(suspension);
    }

    // ─────────────────────────────────────────
    // 3. HISTORIQUE DES SUSPENSIONS
    // ─────────────────────────────────────────
    public Page<SuspensionResponse> getHistoriqueSuspensions(UUID membreId,  // ✅ Long → UUID
                                                             int page,
                                                             int size) {
        Pageable pageable = PageRequest.of(
                page, size, Sort.by("creeAt").descending());
        return suspensionRepository
                .findByMembreId(membreId, pageable)
                .map(this::mapToResponse);
    }

    // ─────────────────────────────────────────
    // 4. SCHEDULER : expiration automatique
    // ─────────────────────────────────────────
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void expireSuspensionsAutomatiquement() {
        List<Suspension> expiredList = suspensionRepository
                .findExpiredSuspensions(LocalDate.now());

        for (Suspension suspension : expiredList) {
            suspension.setStatut(StatutSuspension.EXPIRED);
            suspensionRepository.save(suspension);

            Licence licence = suspension.getLicence();
            licence.setStatut(LicenseStatus.ACTIVE);
            licenceRepository.save(licence);

            User membre = licence.getMembre();
            membre.setActif(true);
            userRepository.save(membre);
        }
    }

    // ─────────────────────────────────────────
    // MAPPER : Suspension → SuspensionResponse
    // ─────────────────────────────────────────
    private SuspensionResponse mapToResponse(Suspension suspension) {
        return SuspensionResponse.builder()
                .id(suspension.getId())
                .licenceId(suspension.getLicence().getId())
                .membreId(suspension.getMembre().getId())
                .membreUsername(suspension.getMembre().getUsername())
                .typeSuspension(suspension.getTypeSuspension())
                .statut(suspension.getStatut())
                .motif(suspension.getMotif())
                .dateDebut(suspension.getDateDebut())
                .dateFin(suspension.getDateFin())
                .raisonLevee(suspension.getRaisonLevee())
                .dateLevee(suspension.getDateLevee())
                .creeParId(suspension.getCreePar().getId())
                .creeAt(suspension.getCreeAt())
                .build();
    }
}