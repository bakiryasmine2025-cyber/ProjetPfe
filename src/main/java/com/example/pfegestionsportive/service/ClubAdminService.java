package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.AddJoueurRequest;
import com.example.pfegestionsportive.dto.request.AddStaffRequest;
import com.example.pfegestionsportive.dto.request.CreateEquipeRequest;
import com.example.pfegestionsportive.dto.request.PartenaireRequest;
import com.example.pfegestionsportive.dto.response.DashboardStatsResponse;
import com.example.pfegestionsportive.dto.response.MatchResponse;
import com.example.pfegestionsportive.dto.response.PartenaireResponse;
import com.example.pfegestionsportive.model.entity.*;
import com.example.pfegestionsportive.model.enums.MatchStatus;
import com.example.pfegestionsportive.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));
    }

    private Club getMyClub() {
        User user = getCurrentUser();
        if (user.getClub() == null) {
            throw new RuntimeException("Vous n'êtes associé à aucun club.");
        }
        return user.getClub();
    }

    private boolean isFederationOrSuperAdmin() {
        return SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_FEDERATION_ADMIN")
                        || a.getAuthority().equals("ROLE_SUPER_ADMIN"));
    }

    // --- Gestion des Joueurs ---
    public Joueur addJoueur(AddJoueurRequest req) {
        Club club = getMyClub();
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
                .build();
        return joueurRepository.save(joueur);
    }

    public List<Joueur> getMyJoueurs() {
        return joueurRepository.findAll().stream()
                .filter(j -> j.getClub().getId().equals(getMyClub().getId()))
                .toList();
    }

    // --- Gestion du Staff ---
    public StaffTechnique addStaff(AddStaffRequest req) {
        Club club = getMyClub();
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
        return staffTechniqueRepository.save(staff);
    }

    public List<StaffTechnique> getMyStaff() {
        return staffTechniqueRepository.findAll().stream()
                .filter(s -> s.getClub().getId().equals(getMyClub().getId()))
                .toList();
    }

    // --- Gestion des Équipes (Sprint 5 & 8) ---
    public Equipe createEquipe(CreateEquipeRequest req) {
        Club club = getMyClub();
        Equipe equipe = Equipe.builder()
                .nom(req.getNom())
                .categorie(req.getCategorie())
                .club(club)
                .build();
        return equipeRepository.save(equipe);
    }

    public List<Equipe> getMyEquipes() {
        return equipeRepository.findByClubId(getMyClub().getId());
    }

    public Equipe updateEquipe(String id, CreateEquipeRequest req) {
        Equipe equipe = equipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipe introuvable"));

        if (!equipe.getClub().getId().equals(getMyClub().getId())) {
            throw new RuntimeException("Accès refusé");
        }

        equipe.setNom(req.getNom());
        equipe.setCategorie(req.getCategorie());
        return equipeRepository.save(equipe);
    }

    public void deleteEquipe(String id) {
        Equipe equipe = equipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipe introuvable"));

        if (!equipe.getClub().getId().equals(getMyClub().getId())) {
            throw new RuntimeException("Accès refusé");
        }
        equipeRepository.delete(equipe);
    }

    @Transactional
    public Equipe addJoueurToEquipe(String equipeId, String joueurId) {
        Club club = getMyClub();
        Equipe equipe = equipeRepository.findById(equipeId)
                .orElseThrow(() -> new RuntimeException("Équipe introuvable"));

        if (!equipe.getClub().getId().equals(club.getId())) {
            throw new RuntimeException("Accès refusé à cette équipe");
        }

        Joueur joueur = joueurRepository.findById(joueurId)
                .orElseThrow(() -> new RuntimeException("Joueur introuvable"));

        if (!joueur.getClub().getId().equals(club.getId())) {
            throw new RuntimeException("Ce joueur n'appartient pas à votre club");
        }

        equipe.getJoueurs().add(joueur);
        return equipeRepository.save(equipe);
    }

    @Transactional
    public Equipe removeJoueurFromEquipe(String equipeId, String joueurId) {
        Club club = getMyClub();
        Equipe equipe = equipeRepository.findById(equipeId)
                .orElseThrow(() -> new RuntimeException("Équipe introuvable"));

        if (!equipe.getClub().getId().equals(club.getId())) {
            throw new RuntimeException("Accès refusé à cette équipe");
        }

        Joueur joueur = joueurRepository.findById(joueurId)
                .orElseThrow(() -> new RuntimeException("Joueur introuvable"));

        equipe.getJoueurs().remove(joueur);
        return equipeRepository.save(equipe);
    }

    public List<MatchResponse> getMatchesByEquipe(String equipeId) {
        Club club = getMyClub();
        Equipe equipe = equipeRepository.findById(equipeId)
                .orElseThrow(() -> new RuntimeException("Équipe introuvable"));

        if (!equipe.getClub().getId().equals(club.getId())) {
            throw new RuntimeException("Accès refusé à cette équipe");
        }

        return matchRepository.findByEquipeId(equipeId).stream()
                .sorted(Comparator.comparing(Match::getDateMatch).reversed())
                .map(this::toMatchResponse)
                .collect(Collectors.toList());
    }

    // --- Gestion des Partenaires (Sprint 6) ---
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
                .club(club)
                .build();
        return toPartenaireResponse(partenaireRepository.save(partenaire));
    }

    public List<PartenaireResponse> getMyPartenaires() {
        return partenaireRepository.findByClubId(getMyClub().getId()).stream()
                .map(this::toPartenaireResponse)
                .toList();
    }

    public PartenaireResponse updatePartenaire(String id, PartenaireRequest req) {
        Partenaire partenaire = partenaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partenaire introuvable"));

        if (!partenaire.getClub().getId().equals(getMyClub().getId())) {
            throw new RuntimeException("Accès refusé");
        }

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

    public void deletePartenaire(String id) {
        Partenaire partenaire = partenaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partenaire introuvable"));

        if (!partenaire.getClub().getId().equals(getMyClub().getId())) {
            throw new RuntimeException("Accès refusé");
        }
        partenaireRepository.delete(partenaire);
    }

    // --- Dashboard & Calendar (Sprint 6) ---
    public DashboardStatsResponse getDashboardStats() {
        Club club = getMyClub();
        String clubId = club.getId();

        long nbJoueurs = joueurRepository.findAll().stream()
                .filter(j -> j.getClub().getId().equals(clubId)).count();
        long nbEquipes = equipeRepository.findByClubId(clubId).size();
        long nbStaff = staffTechniqueRepository.findAll().stream()
                .filter(s -> s.getClub().getId().equals(clubId)).count();
        long nbPartenaires = partenaireRepository.findByClubId(clubId).size();

        long nbMatchsAVenir = matchRepository.findByClubId(clubId).stream()
                .filter(m -> m.getDateMatch().isAfter(LocalDateTime.now()))
                .count();

        return DashboardStatsResponse.builder()
                .nomClub(club.getNom())
                .nombreJoueurs(nbJoueurs)
                .nombreEquipes(nbEquipes)
                .nombreStaff(nbStaff)
                .nombrePartenaires(nbPartenaires)
                .build();
    }

    public List<MatchResponse> getMyCalendar() {
        List<Match> matches;

        if (isFederationOrSuperAdmin()) {
            // FEDERATION_ADMIN w SUPER_ADMIN ychoufu kol el matches
            matches = matchRepository.findAll();
        } else {
            // CLUB_ADMIN ychouf bas matches el club mte3o
            Club club = getMyClub();
            matches = matchRepository.findByClubId(club.getId());
        }

        return matches.stream()
                .sorted(Comparator.comparing(Match::getDateMatch))
                .map(this::toMatchResponse)
                .collect(Collectors.toList());
    }

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
                .build();
    }

    private MatchResponse toMatchResponse(Match m) {
        return MatchResponse.builder()
                .id(m.getId())
                .competitionNom(m.getCompetition() != null ? m.getCompetition().getNom() : "Amical")
                .equipeDomicile(m.getEquipeDomicile() != null ? m.getEquipeDomicile().getNom() : "?")
                .equipeExterieur(m.getEquipeExterieur() != null ? m.getEquipeExterieur().getNom() : "?")
                .dateMatch(m.getDateMatch())
                .lieu(m.getLieu())
                .score(m.getStatut() == MatchStatus.TERMINE
                        ? (m.getScoreDomicile() != null ? m.getScoreDomicile() : 0) + " - " + (m.getScoreExterieur() != null ? m.getScoreExterieur() : 0)
                        : "N/A")
                .statut(m.getStatut().name())
                .build();
    }
}