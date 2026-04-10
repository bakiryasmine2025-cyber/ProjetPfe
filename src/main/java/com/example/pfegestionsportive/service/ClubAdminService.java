package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.AddJoueurRequest;
import com.example.pfegestionsportive.dto.request.AddStaffRequest;
import com.example.pfegestionsportive.dto.request.CreateEquipeRequest;
import com.example.pfegestionsportive.dto.request.PartenaireRequest;
import com.example.pfegestionsportive.dto.response.DashboardStatsResponse;
import com.example.pfegestionsportive.dto.response.JoueurAvecClubDTO;
import com.example.pfegestionsportive.dto.response.MatchResponse;
import com.example.pfegestionsportive.dto.response.PartenaireResponse;
import com.example.pfegestionsportive.model.entity.*;
import com.example.pfegestionsportive.model.enums.PartenaireStatut;
import com.example.pfegestionsportive.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClubAdminService {

    private final JoueurRepository joueurRepository;
    private final StaffTechniqueRepository staffTechniqueRepository;
    private final EquipeRepository equipeRepository;
    private final PartenaireRepository partenaireRepository;
    private final UserRepository userRepository;
    private final MatchRepository matchRepository;
    private final ClubRepository clubRepository;
    private final JdbcTemplate jdbcTemplate;

    // ─────────────────────────────────────────
    // --- Helpers ---
    // ─────────────────────────────────────────

    private Club getMyClub() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmailWithClub(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));
        if (user.getClub() == null)
            throw new RuntimeException("Vous n'êtes associé à aucun club.");
        return user.getClub();
    }

    private boolean isSuperOrFedAdmin() {
        return SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN")
                        || a.getAuthority().equals("ROLE_FEDERATION_ADMIN"));
    }

    // Lit club_id depuis personnes (JOINED inheritance fix)
    private String getPersonneClubId(String personneId) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT club_id FROM personnes WHERE id = ?",
                    String.class, personneId);
        } catch (Exception e) { return null; }
    }

    // Lit club_id depuis equipes via SQL direct
    private String getEquipeClubId(String equipeId) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT club_id FROM equipes WHERE id = ?",
                    String.class, equipeId);
        } catch (Exception e) { return null; }
    }

    private void verifierAppartenanceEquipe(String equipeId) {
        if (isSuperOrFedAdmin()) return;
        String equipeClubId = getEquipeClubId(equipeId);
        if (equipeClubId == null) return;
        if (!equipeClubId.equals(getMyClub().getId()))
            throw new AccessDeniedException("Accès refusé : cette équipe n'appartient pas à votre club");
    }

    private void verifierAppartenanceClub(String entityClubId) {
        if (isSuperOrFedAdmin()) return;
        if (entityClubId == null) return;
        if (!entityClubId.equals(getMyClub().getId()))
            throw new AccessDeniedException("Accès refusé");
    }

    // ─────────────────────────────────────────
    // --- Tous les joueurs avec club (federation) ---
    // ─────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<JoueurAvecClubDTO> getAllJoueursAvecClub() {
        return joueurRepository.findAll().stream()
                .map(j -> {
                    Club club = j.getClub();
                    return JoueurAvecClubDTO.builder()
                            .id(j.getId())
                            .nom(j.getNom())
                            .prenom(j.getPrenom())
                            .genre(j.getGenre())
                            .poste(j.getPoste())
                            .categorie(j.getCategorie())
                            .telephone(j.getTelephone())
                            .statut(j.getStatut())
                            .clubId(club != null ? club.getId() : null)
                            .clubNom(club != null ? club.getNom() : "Sans club")
                            .build();
                })
                .toList();
    }

    // ─────────────────────────────────────────
    // --- Gestion des Joueurs ---
    // ─────────────────────────────────────────

    @Transactional
    public Joueur addJoueur(AddJoueurRequest req) {
        Club club;
        if (isSuperOrFedAdmin()) {
            if (req.getClubId() == null || req.getClubId().isBlank())
                throw new RuntimeException("Veuillez sélectionner un club.");
            club = clubRepository.findById(req.getClubId())
                    .orElseThrow(() -> new RuntimeException("Club introuvable"));
        } else {
            club = getMyClub();
        }
        Joueur joueur = Joueur.builder()
                .nom(req.getNom())
                .prenom(req.getPrenom())
                .dateNaissance(req.getDateNaissance())
                .genre(req.getGenre())
                .telephone(req.getTelephone())
                .email(req.getEmail())
                .club(club)
                .poste(req.getPoste())
                .categorie(req.getCategorie())
                .cin(req.getCin())                                                    // ← zid
                .numeroLicence(req.getNumeroLicence())                                // ← zid
                .certificatMedical(req.getCertificatMedical() != null
                        ? req.getCertificatMedical() : false)                        // ← zid
                .statut("EN_ATTENTE")
                .build();
        Joueur saved = joueurRepository.save(joueur);
        joueurRepository.updatePersonneClubId(saved.getId(), club.getId());
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Joueur> getMyJoueurs() {
        if (isSuperOrFedAdmin()) return joueurRepository.findAll();
        return joueurRepository.findByClubId(getMyClub().getId());
    }

    @Transactional
    public Joueur updateJoueur(String id, AddJoueurRequest req) {
        joueurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Joueur non trouvé"));
        verifierAppartenanceClub(getPersonneClubId(id));
        Joueur joueur = joueurRepository.findById(id).get();
        joueur.setNom(req.getNom());
        joueur.setPrenom(req.getPrenom());
        joueur.setDateNaissance(req.getDateNaissance());
        joueur.setGenre(req.getGenre());
        joueur.setTelephone(req.getTelephone());
        joueur.setEmail(req.getEmail());
        joueur.setPoste(req.getPoste());
        joueur.setCategorie(req.getCategorie());
        return joueurRepository.save(joueur);
    }

    @Transactional
    public void deleteJoueur(String id) {
        joueurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Joueur non trouvé"));
        verifierAppartenanceClub(getPersonneClubId(id));
        joueurRepository.deleteById(id);
    }

    // ─────────────────────────────────────────
    // --- Activation des joueurs ---
    // ─────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<Joueur> getJoueursEnAttente() {
        if (isSuperOrFedAdmin()) return joueurRepository.findByStatut("EN_ATTENTE");
        return joueurRepository.findByStatutAndClubId("EN_ATTENTE", getMyClub().getId());
    }

    @Transactional
    public Joueur accepterJoueur(String id) {
        Joueur joueur = joueurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Joueur non trouvé"));
        verifierAppartenanceClub(getPersonneClubId(id));
        joueur.setStatut("ACCEPTE");
        return joueurRepository.save(joueur);
    }

    @Transactional
    public Joueur bloquerJoueur(String id) {
        Joueur joueur = joueurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Joueur non trouvé"));
        verifierAppartenanceClub(getPersonneClubId(id));
        joueur.setStatut("BLOQUE");
        return joueurRepository.save(joueur);
    }

    // ─────────────────────────────────────────
    // --- Gestion du Staff ---
    // ─────────────────────────────────────────

    @Transactional
    public StaffTechnique addStaff(AddStaffRequest req) {
        Club club;
        if (isSuperOrFedAdmin()) {
            if (req.getClubId() == null || req.getClubId().isBlank())
                throw new RuntimeException("Veuillez sélectionner un club.");
            club = clubRepository.findById(req.getClubId())
                    .orElseThrow(() -> new RuntimeException("Club introuvable"));
        } else {
            club = getMyClub();
        }
        StaffTechnique staff = StaffTechnique.builder()
                .nom(req.getNom())
                .prenom(req.getPrenom())
                .dateNaissance(req.getDateNaissance())
                .genre(req.getGenre())
                .telephone(req.getTelephone())
                .email(req.getEmail())
                .club(club)
                .typeStaff(req.getTypeStaff())
                .qualification(req.getQualification())
                .anneeExperience(req.getAnneeExperience())
                .build();
        StaffTechnique saved = staffTechniqueRepository.save(staff);
        joueurRepository.updatePersonneClubId(saved.getId(), club.getId());
        return saved;
    }

    @Transactional(readOnly = true)
    public List<StaffTechnique> getMyStaff() {
        if (isSuperOrFedAdmin()) return staffTechniqueRepository.findAll();
        return staffTechniqueRepository.findByClubId(getMyClub().getId());
    }

    @Transactional
    public StaffTechnique updateStaff(String id, AddStaffRequest req) {
        StaffTechnique staff = staffTechniqueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff non trouvé"));
        verifierAppartenanceClub(staff.getClub() != null ? staff.getClub().getId() : null);
        staff.setNom(req.getNom());
        staff.setPrenom(req.getPrenom());
        staff.setDateNaissance(req.getDateNaissance());
        staff.setGenre(req.getGenre());
        staff.setTelephone(req.getTelephone());
        staff.setEmail(req.getEmail());
        staff.setTypeStaff(req.getTypeStaff());
        staff.setQualification(req.getQualification());
        staff.setAnneeExperience(req.getAnneeExperience());
        return staffTechniqueRepository.save(staff);
    }

    @Transactional
    public void deleteStaff(String id) {
        StaffTechnique staff = staffTechniqueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff non trouvé"));
        verifierAppartenanceClub(staff.getClub() != null ? staff.getClub().getId() : null);
        staffTechniqueRepository.delete(staff);
    }

    // ─────────────────────────────────────────
    // --- Gestion des Équipes ---
    // ─────────────────────────────────────────

    @Transactional
    public Equipe createEquipe(CreateEquipeRequest req) {
        Club club = getMyClub();
        Equipe equipe = Equipe.builder()
                .nom(req.getNom())
                .categorie(req.getCategorie())
                .genre(req.getGenre())
                .club(club)
                .build();
        return equipeRepository.save(equipe);
    }

    @Transactional(readOnly = true)
    public List<Equipe> getMyEquipes() {
        if (isSuperOrFedAdmin()) return equipeRepository.findAll();
        return equipeRepository.findByClubId(getMyClub().getId());
    }

    @Transactional
    public Equipe updateEquipe(String id, CreateEquipeRequest req) {
        equipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipe introuvable"));
        verifierAppartenanceEquipe(id);
        Equipe equipe = equipeRepository.findById(id).get();
        equipe.setNom(req.getNom());
        equipe.setCategorie(req.getCategorie());
        equipe.setGenre(req.getGenre());
        return equipeRepository.save(equipe);
    }

    @Transactional
    public void deleteEquipe(String id) {
        equipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipe introuvable"));
        verifierAppartenanceEquipe(id);
        equipeRepository.deleteById(id);
    }

    @Transactional
    public Equipe addJoueurToEquipe(String equipeId, String joueurId) {
        Equipe equipe = equipeRepository.findById(equipeId)
                .orElseThrow(() -> new RuntimeException("Équipe introuvable"));
        verifierAppartenanceEquipe(equipeId);

        Joueur joueur = joueurRepository.findById(joueurId)
                .orElseThrow(() -> new RuntimeException("Joueur introuvable"));

        if (!isSuperOrFedAdmin()) {
            String joueurClubId = getPersonneClubId(joueurId);
            String equipeClubId = getEquipeClubId(equipeId);
            if (joueurClubId == null || !joueurClubId.equals(equipeClubId))
                throw new AccessDeniedException("Ce joueur n'appartient pas à votre club");
        }

        equipe.getJoueurs().add(joueur);
        return equipeRepository.save(equipe);
    }

    @Transactional
    public Equipe removeJoueurFromEquipe(String equipeId, String joueurId) {
        Equipe equipe = equipeRepository.findById(equipeId)
                .orElseThrow(() -> new RuntimeException("Équipe introuvable"));
        verifierAppartenanceEquipe(equipeId);
        Joueur joueur = joueurRepository.findById(joueurId)
                .orElseThrow(() -> new RuntimeException("Joueur introuvable"));
        equipe.getJoueurs().remove(joueur);
        return equipeRepository.save(equipe);
    }

    @Transactional(readOnly = true)
    public List<MatchResponse> getMatchesByEquipe(String equipeId) {
        equipeRepository.findById(equipeId)
                .orElseThrow(() -> new RuntimeException("Équipe introuvable"));
        verifierAppartenanceEquipe(equipeId);
        return matchRepository.findByClub(equipeId).stream()
                .sorted(Comparator.comparing(Match::getDateMatch).reversed())
                .map(this::toMatchResponse)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────
    // --- Gestion des Partenaires ---
    // ─────────────────────────────────────────

    @Transactional
    public PartenaireResponse addPartenaire(PartenaireRequest req) {
        Club club = getMyClub();
        Partenaire partenaire = Partenaire.builder()
                .nom(req.getNom())
                .type(req.getType())
                .secteur(req.getSecteur())
                .emailContact(req.getEmailContact())
                .urlLogo(req.getUrlLogo())
                .siteWeb(req.getSiteWeb())
                .dateDebutContrat(req.getDateDebutContrat())
                .dateFinContrat(req.getDateFinContrat())
                .actif(req.isActif())
                .statut(PartenaireStatut.EN_ATTENTE)
                .club(club)
                .build();
        return toPartenaireResponse(partenaireRepository.save(partenaire));
    }

    @Transactional(readOnly = true)
    public List<PartenaireResponse> getMyPartenaires() {
        if (isSuperOrFedAdmin()) {
            return partenaireRepository.findAll().stream()
                    .map(this::toPartenaireResponse).toList();
        }
        return partenaireRepository.findByClubId(getMyClub().getId()).stream()
                .map(this::toPartenaireResponse).toList();
    }

    @Transactional
    public PartenaireResponse updatePartenaire(String id, PartenaireRequest req) {
        Partenaire partenaire = partenaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partenaire introuvable"));
        verifierAppartenanceClub(partenaire.getClub() != null ? partenaire.getClub().getId() : null);
        partenaire.setNom(req.getNom());
        partenaire.setType(req.getType());
        partenaire.setSecteur(req.getSecteur());
        partenaire.setEmailContact(req.getEmailContact());
        partenaire.setUrlLogo(req.getUrlLogo());
        partenaire.setSiteWeb(req.getSiteWeb());
        partenaire.setDateDebutContrat(req.getDateDebutContrat());
        partenaire.setDateFinContrat(req.getDateFinContrat());
        partenaire.setActif(req.isActif());
        return toPartenaireResponse(partenaireRepository.save(partenaire));
    }

    @Transactional
    public void deletePartenaire(String id) {
        Partenaire partenaire = partenaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partenaire introuvable"));
        verifierAppartenanceClub(partenaire.getClub() != null ? partenaire.getClub().getId() : null);
        partenaireRepository.delete(partenaire);
    }

    // ─────────────────────────────────────────
    // --- Dashboard ---
    // ─────────────────────────────────────────

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        if (isSuperOrFedAdmin()) {
            return DashboardStatsResponse.builder()
                    .nomClub("Fédération Rugby Tunisie")
                    .nombreJoueurs(joueurRepository.count())
                    .nombreEquipes(equipeRepository.count())
                    .nombreStaff(staffTechniqueRepository.count())
                    .nombrePartenaires(partenaireRepository.count())
                    .build();
        }

        // ── FIX : findByEmailWithClub garantit JOIN FETCH du club ──────────
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmailWithClub(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

        if (user.getClub() == null)
            throw new RuntimeException("Compte non associé à un club.");

        Club club = user.getClub();
        String clubId = club.getId();
        // ──────────────────────────────────────────────────────────────────

        return DashboardStatsResponse.builder()
                .nomClub(club.getNom())
                .nombreJoueurs(joueurRepository.findByClubId(clubId).size())
                .nombreEquipes(equipeRepository.findByClubId(clubId).size())
                .nombreStaff(staffTechniqueRepository.findByClubId(clubId).size())
                .nombrePartenaires(partenaireRepository.findByClubId(clubId).size())
                .build();
    }

    // ─────────────────────────────────────────
    // --- Calendrier ---
    // ─────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<MatchResponse> getMyCalendar() {
        if (isSuperOrFedAdmin()) {
            return matchRepository.findAll().stream()
                    .sorted(Comparator.comparing(Match::getDateMatch))
                    .map(this::toMatchResponse)
                    .collect(Collectors.toList());
        }
        Club club = getMyClub();
        return matchRepository.findByClub(club.getId()).stream()
                .sorted(Comparator.comparing(Match::getDateMatch))
                .map(this::toMatchResponse)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────
    // --- Mappers ---
    // ─────────────────────────────────────────

    private PartenaireResponse toPartenaireResponse(Partenaire p) {
        return PartenaireResponse.builder()
                .id(p.getId())
                .nom(p.getNom())
                .type(p.getType() != null ? p.getType().name() : null)
                .secteur(p.getSecteur())
                .emailContact(p.getEmailContact())
                .urlLogo(p.getUrlLogo())
                .siteWeb(p.getSiteWeb())
                .dateDebutContrat(p.getDateDebutContrat())
                .dateFinContrat(p.getDateFinContrat())
                .actif(p.isActif())
                .dateCreation(p.getDateCreation())
                .statut(p.getStatut() != null ? p.getStatut().name() : null)
                .build();
    }

    private MatchResponse toMatchResponse(Match m) {
        return MatchResponse.builder()
                .id(m.getId())
                .competitionNom(m.getCompetition() != null ? m.getCompetition().getNom() : "Amical")
                .equipeDomicileNom(m.getEquipeDomicile() != null ? m.getEquipeDomicile().getNom() : "?")
                .equipeExterieureNom(m.getEquipeExterieur() != null ? m.getEquipeExterieur().getNom() : "?")
                .dateMatch(m.getDateMatch())
                .lieu(m.getLieu())
                .scoreDomicile(m.getScoreDomicile())
                .scoreExterieur(m.getScoreExterieur())
                .statut(m.getStatut().name())
                .build();
    }
}