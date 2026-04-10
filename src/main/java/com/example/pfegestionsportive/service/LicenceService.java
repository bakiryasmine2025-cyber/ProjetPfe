package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.LicenceRequest;
import com.example.pfegestionsportive.dto.response.LicenceResponse;
import com.example.pfegestionsportive.model.entity.*;
import com.example.pfegestionsportive.model.enums.*;
import com.example.pfegestionsportive.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LicenceService {

    private final LicenceRepository licenceRepository;
    private final PersonneRepository personneRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;
    private final JdbcTemplate jdbcTemplate;

    // ═══════════════════════════════════════════════
    // HELPER — lit club_id depuis personnes (JOINED inheritance fix)
    // ═══════════════════════════════════════════════

    private String getPersonneClubId(String personneId) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT club_id FROM personnes WHERE id = ?",
                    String.class, personneId);
        } catch (Exception e) {
            return null;
        }
    }

    // ═══════════════════════════════════════════════
    // CLUB_ADMIN — soumettre demande → PENDING
    // ═══════════════════════════════════════════════

    @Transactional
    public LicenceResponse soumettreDemandeClub(LicenceRequest req) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmailWithClub(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (user.getClub() == null)
            throw new RuntimeException("Vous n'êtes associé à aucun club.");

        Personne personne = personneRepository.findById(req.getPersonneId())
                .orElseThrow(() -> new RuntimeException("Personne introuvable"));

        String personneClubId = getPersonneClubId(personne.getId());
        if (personneClubId == null || !personneClubId.equals(user.getClub().getId()))
            throw new RuntimeException("Cette personne n'appartient pas à votre club.");

        if (licenceRepository.existsByPersonneIdAndStatut(personne.getId(), LicenceStatus.ACTIVE))
            throw new RuntimeException("Cette personne a déjà une licence active.");

        if (licenceRepository.existsByPersonneIdAndStatut(personne.getId(), LicenceStatus.PENDING))
            throw new RuntimeException("Une demande est déjà en attente pour cette personne.");

        Licence licence = Licence.builder()
                .numero("LIC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .type(req.getType())
                .dateEmission(LocalDate.now())
                .dateExpiration(req.getDateExpiration())
                .aptitudeMedicale(req.getAptitudeMedicale() != null ? req.getAptitudeMedicale() : false)
                .statut(LicenceStatus.PENDING)
                .personne(personne)
                .club(user.getClub())
                .build();

        return toResponse(licenceRepository.save(licence));
    }

    // ═══════════════════════════════════════════════
    // FEDERATION_ADMIN + SUPER_ADMIN — créer directement → ACTIVE
    // ═══════════════════════════════════════════════

    @Transactional
    public LicenceResponse creerDirecte(LicenceRequest req) {
        Personne personne = personneRepository.findById(req.getPersonneId())
                .orElseThrow(() -> new RuntimeException("Personne introuvable"));

        if (licenceRepository.existsByPersonneIdAndStatut(personne.getId(), LicenceStatus.ACTIVE))
            throw new RuntimeException("Cette personne a déjà une licence active.");

        String personneClubId = getPersonneClubId(personne.getId());
        Club club = null;
        if (personneClubId != null) {
            club = jdbcTemplate.queryForObject(
                    "SELECT id FROM clubs WHERE id = ?",
                    (rs, rowNum) -> {
                        Club c = new Club();
                        c.setId(rs.getString("id"));
                        return c;
                    }, personneClubId);
        }

        Licence licence = Licence.builder()
                .numero("LIC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .type(req.getType())
                .dateEmission(LocalDate.now())
                .dateExpiration(req.getDateExpiration())
                .aptitudeMedicale(req.getAptitudeMedicale() != null ? req.getAptitudeMedicale() : false)
                .statut(LicenceStatus.ACTIVE)
                .personne(personne)
                .club(club)
                .build();

        return toResponse(licenceRepository.save(licence));
    }

    // ═══════════════════════════════════════════════
    // PENDING → APPROVED
    // ═══════════════════════════════════════════════

    @Transactional
    public LicenceResponse approuverLicence(String licenceId) {
        Licence licence = findById(licenceId);

        if (licence.getStatut() != LicenceStatus.PENDING)
            throw new RuntimeException("Seules les licences PENDING peuvent être approuvées.");

        licence.setStatut(LicenceStatus.APPROVED);
        licence.setMotifRefus(null);

        envoyerNotification(licence, "Licence approuvée",
                "Votre demande " + licence.getNumero() + " a été approuvée. Elle sera activée prochainement.");

        return toResponse(licenceRepository.save(licence));
    }

    // ═══════════════════════════════════════════════
    // APPROVED → ACTIVE (option 2: renouvelle si date passée)
    // ═══════════════════════════════════════════════

    @Transactional
    public LicenceResponse activerLicence(String licenceId) {
        Licence licence = findById(licenceId);

        if (licence.getStatut() != LicenceStatus.APPROVED)
            throw new RuntimeException("Seules les licences APPROVED peuvent être activées.");

        if (Boolean.FALSE.equals(licence.getAptitudeMedicale()))
            throw new RuntimeException("Aptitude médicale non validée.");


        if (licence.getDateExpiration() != null && licence.getDateExpiration().isBefore(LocalDate.now())) {
            licence.setDateExpiration(LocalDate.now().plusYears(1));
        }

        licence.setStatut(LicenceStatus.ACTIVE);

        envoyerNotification(licence, "Licence activée",
                "Votre licence " + licence.getNumero() + " est maintenant active jusqu'au "
                        + licence.getDateExpiration() + ".");

        return toResponse(licenceRepository.save(licence));
    }

    // ═══════════════════════════════════════════════
    // PENDING ou APPROVED → REJECTED
    // ═══════════════════════════════════════════════

    @Transactional
    public LicenceResponse refuserLicence(String licenceId, String motif) {
        Licence licence = findById(licenceId);

        if (licence.getStatut() != LicenceStatus.PENDING && licence.getStatut() != LicenceStatus.APPROVED)
            throw new RuntimeException("Seules les licences PENDING ou APPROVED peuvent être refusées.");

        licence.setStatut(LicenceStatus.REJECTED);
        licence.setMotifRefus(motif);

        envoyerNotification(licence, "Licence refusée",
                "Votre demande " + licence.getNumero() + " a été refusée."
                        + (motif != null && !motif.isBlank() ? "\nMotif : " + motif : ""));

        return toResponse(licenceRepository.save(licence));
    }

    // ═══════════════════════════════════════════════
    // ACTIVE → SUSPENDED
    // ═══════════════════════════════════════════════

    @Transactional
    public LicenceResponse suspendreLicence(String licenceId, String raison) {
        Licence licence = findById(licenceId);

        if (licence.getStatut() != LicenceStatus.ACTIVE)
            throw new RuntimeException("Seules les licences ACTIVE peuvent être suspendues.");

        licence.setStatut(LicenceStatus.SUSPENDED);
        licence.setMotifRefus(raison);

        envoyerNotification(licence, "Licence suspendue",
                "Votre licence " + licence.getNumero() + " a été suspendue."
                        + (raison != null && !raison.isBlank() ? "\nRaison : " + raison : ""));

        return toResponse(licenceRepository.save(licence));
    }

    // ═══════════════════════════════════════════════
    // SUSPENDED ou EXPIRED → ACTIVE (+1 an)
    // ═══════════════════════════════════════════════

    @Transactional
    public LicenceResponse renouvelerLicence(String licenceId) {
        Licence licence = findById(licenceId);

        if (licence.getStatut() != LicenceStatus.ACTIVE
                && licence.getStatut() != LicenceStatus.SUSPENDED
                && licence.getStatut() != LicenceStatus.EXPIRED)
            throw new RuntimeException("Seules les licences ACTIVE, SUSPENDED ou EXPIRED peuvent être renouvelées.");

        licence.setStatut(LicenceStatus.ACTIVE);
        licence.setDateExpiration(LocalDate.now().plusYears(1));
        licence.setMotifRefus(null);

        envoyerNotification(licence, "Licence renouvelée",
                "Votre licence " + licence.getNumero() + " a été renouvelée. Nouvelle expiration : "
                        + licence.getDateExpiration());

        return toResponse(licenceRepository.save(licence));
    }

    // ═══════════════════════════════════════════════
    // LECTURE
    // ═══════════════════════════════════════════════

    public List<LicenceResponse> getAllLicences() {
        return licenceRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<LicenceResponse> getLicencesByClubAdmin() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmailWithClub(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (user.getClub() == null)
            throw new RuntimeException("Vous n'êtes associé à aucun club.");

        return licenceRepository.findByClubId(user.getClub().getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<LicenceResponse> getLicencesByStatut(LicenceStatus statut) {
        return licenceRepository.findByStatut(statut).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public LicenceResponse getLicenceById(String id) {
        return toResponse(findById(id));
    }

    // ═══════════════════════════════════════════════
    // Vérification avant match
    // ═══════════════════════════════════════════════

    public void verifierLicenceAvantMatch(String personneId) {
        Licence licence = licenceRepository
                .findByPersonneIdAndStatut(personneId, LicenceStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("Ce joueur n'a pas de licence active."));

        if (licence.getDateExpiration() != null && licence.getDateExpiration().isBefore(LocalDate.now()))
            throw new RuntimeException("La licence du joueur est expirée.");

        if (Boolean.FALSE.equals(licence.getAptitudeMedicale()))
            throw new RuntimeException("Aptitude médicale non validée.");
    }

    // ═══════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════

    private Licence findById(String id) {
        return licenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Licence introuvable : " + id));
    }

    private void envoyerNotification(Licence licence, String sujet, String contenu) {
        try {
            if (licence.getPersonne() == null || licence.getPersonne().getEmail() == null) return;
            userRepository.findByEmail(licence.getPersonne().getEmail()).ifPresent(receiver -> {
                userRepository.findFirstByRole(Role.FEDERATION_ADMIN).ifPresent(sender -> {
                    Message msg = Message.builder()
                            .sender(sender)
                            .receiver(receiver)
                            .sujet(sujet)
                            .contenu(contenu)
                            .build();
                    messageRepository.save(msg);
                });
            });
        } catch (Exception ignored) {}
    }

    private LicenceResponse toResponse(Licence l) {
        return LicenceResponse.builder()
                .id(l.getId())
                .numero(l.getNumero())
                .type(l.getType() != null ? l.getType().name() : null)
                .dateEmission(l.getDateEmission())
                .dateExpiration(l.getDateExpiration())
                .statut(l.getStatut().name())
                .aptitudeMedicale(l.getAptitudeMedicale())
                .motifRefus(l.getMotifRefus())
                .personneId(l.getPersonne() != null ? l.getPersonne().getId() : null)
                .personneNom(l.getPersonne() != null
                        ? l.getPersonne().getNom() + " " + l.getPersonne().getPrenom()
                        : "—")
                .clubNom(l.getClub() != null ? l.getClub().getNom() : "—")
                .build();
    }
}