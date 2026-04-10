package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.ClubRequest;
import com.example.pfegestionsportive.dto.request.ClubSuspensionRequest;
import com.example.pfegestionsportive.dto.response.ClubResponse;
import com.example.pfegestionsportive.model.entity.Club;
import com.example.pfegestionsportive.model.enums.ClubStatus;
import com.example.pfegestionsportive.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClubService {

    private final ClubRepository clubRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final JoueurRepository joueurRepository;
    private final StaffTechniqueRepository staffTechniqueRepository;
    private final EquipeRepository equipeRepository;
    private final PartenaireRepository partenaireRepository;
    private final LicenceRepository licenceRepository;
    private final PersonneRepository personneRepository;

    public ClubResponse create(ClubRequest req) {
        if (clubRepository.existsByNom(req.getNom()))
            throw new RuntimeException("Un club avec ce nom existe déjà");

        Club club = Club.builder()
                .nom(req.getNom())
                .nomCourt(req.getNomCourt())
                .ville(req.getVille())
                .region(req.getRegion())
                .anneeFondation(req.getAnneeFondation())
                .email(req.getEmail())
                .telephone(req.getTelephone())
                .urlLogo(req.getUrlLogo())
                .adresse(req.getAdresse())
                .statut(ClubStatus.ACTIF)
                .build();

        return toResponse(clubRepository.save(club));
    }

    public List<ClubResponse> getAll() {
        return clubRepository.findAllByOrderByDateCreationDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ClubResponse getById(String id) {
        return toResponse(findById(id));
    }

    public ClubResponse update(String id, ClubRequest req) {
        Club club = findById(id);

        if (req.getNom() != null)            club.setNom(req.getNom());
        if (req.getNomCourt() != null)       club.setNomCourt(req.getNomCourt());
        if (req.getVille() != null)          club.setVille(req.getVille());
        if (req.getRegion() != null)         club.setRegion(req.getRegion());
        if (req.getAnneeFondation() != null) club.setAnneeFondation(req.getAnneeFondation());
        if (req.getEmail() != null)          club.setEmail(req.getEmail());
        if (req.getTelephone() != null)      club.setTelephone(req.getTelephone());
        if (req.getUrlLogo() != null)        club.setUrlLogo(req.getUrlLogo());
        if (req.getAdresse() != null)        club.setAdresse(req.getAdresse());

        club.setDateMiseAJour(LocalDateTime.now());
        return toResponse(clubRepository.save(club));
    }

    public ClubResponse changerStatut(String id, ClubSuspensionRequest req) {
        Club club = findById(id);

        if (req.getStatut() == ClubStatus.SUSPENDU &&
                (req.getMotif() == null || req.getMotif().isBlank()))
            throw new RuntimeException("Le motif est obligatoire pour une suspension");

        ClubStatus ancienStatut = club.getStatut();
        club.setStatut(req.getStatut());

        if (req.getMotif() != null && !req.getMotif().isBlank())
            club.setMotifSuspension(req.getMotif());

        club.setDateMiseAJour(LocalDateTime.now());
        clubRepository.save(club);

        if (club.getEmail() != null && !club.getEmail().isBlank()) {
            String sujet   = buildStatutSujet(req.getStatut());
            String contenu = buildStatutContenu(club.getNom(), ancienStatut,
                    req.getStatut(), req.getMotif());
            emailService.sendStatusChangeEmail(club.getEmail(), club.getNom(), sujet, contenu);
        }

        return toResponse(club);
    }

    @Transactional
    public void delete(String id) {
        Club club = findById(id);

        // 1. فك ربط الـ users من الكلب
        userRepository.findAll().stream()
                .filter(u -> u.getClub() != null && u.getClub().getId().equals(id))
                .forEach(u -> {
                    u.setClub(null);
                    userRepository.save(u);
                });

        // 2. حذف user_clubs_suivis
        userRepository.deleteClubsSuivisByClubId(id);

        // 3. حذف licences
        licenceRepository.deleteByClubId(id);

        // 4. حذف equipe_joueurs
        joueurRepository.deleteEquipeJoueursByClubId(id);

        // 5. حذف staff_technique
        staffTechniqueRepository.deleteStaffByClubId(id);

        // 6. حذف joueurs
        joueurRepository.deleteJoueursByClubId(id);

        // 7. حذف personnes
        personneRepository.deleteAllByClubId(id);

        // 8. حذف équipes
        equipeRepository.deleteByClubId(id);

        // 9. حذف partenaires
        partenaireRepository.deleteByClubId(id);

        // 10. حذف club
        clubRepository.delete(club);
    }

    private Club findById(String id) {
        return clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Club introuvable"));
    }

    private String buildStatutSujet(ClubStatus statut) {
        return switch (statut) {
            case ACTIF    -> "Votre club a été réactivé";
            case INACTIF  -> "Votre club a été désactivé";
            case SUSPENDU -> "Votre club a été suspendu";
            case ARCHIVE  -> "Votre club a été archivé";
        };
    }

    private String buildStatutContenu(String nomClub, ClubStatus ancien,
                                      ClubStatus nouveau, String motif) {
        StringBuilder sb = new StringBuilder();
        sb.append("Bonjour,\n\nLe statut du club ")
                .append(nomClub).append(" a été modifié.\n")
                .append("Ancien statut : ").append(ancien.name()).append("\n")
                .append("Nouveau statut : ").append(nouveau.name()).append("\n");
        if (motif != null && !motif.isBlank())
            sb.append("Motif : ").append(motif).append("\n");
        sb.append("\nFédération Tunisienne de Rugby");
        return sb.toString();
    }

    private ClubResponse toResponse(Club c) {
        return ClubResponse.builder()
                .id(c.getId())
                .nom(c.getNom())
                .nomCourt(c.getNomCourt())
                .ville(c.getVille())
                .region(c.getRegion())
                .anneeFondation(c.getAnneeFondation())
                .email(c.getEmail())
                .telephone(c.getTelephone())
                .urlLogo(c.getUrlLogo())
                .adresse(c.getAdresse())
                .statut(c.getStatut().name())
                .motifSuspension(c.getMotifSuspension())
                .dateCreation(c.getDateCreation())
                .dateMiseAJour(c.getDateMiseAJour())
                //  compter les joueurs du club
                .nombreJoueurs(joueurRepository.countByClubId(c.getId()))
                .build();
    }
}