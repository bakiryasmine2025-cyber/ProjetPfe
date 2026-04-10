package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.FederationRequest;
import com.example.pfegestionsportive.dto.request.PartenaireRequest;
import com.example.pfegestionsportive.dto.response.FederationResponse;
import com.example.pfegestionsportive.dto.response.PartenaireResponse;
import com.example.pfegestionsportive.model.entity.Federation;
import com.example.pfegestionsportive.model.entity.Partenaire;
import com.example.pfegestionsportive.repository.FederationRepository;
import com.example.pfegestionsportive.repository.PartenaireRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FederationService {

    private final FederationRepository federationRepository;
    private final PartenaireRepository partenaireRepository; // ✅ ajouté

    // ─────────────────────────────────────────
    // --- Paramètres fédération ---
    // ─────────────────────────────────────────

    public FederationResponse get() {
        Federation fed = federationRepository.findFirstByOrderByDateCreationAsc()
                .orElseThrow(() -> new RuntimeException("Fédération non configurée"));
        return toResponse(fed);
    }

    public FederationResponse update(FederationRequest req) {
        Federation fed = federationRepository.findFirstByOrderByDateCreationAsc()
                .orElse(Federation.builder().build());

        if (req.getNom() != null)              fed.setNom(req.getNom());
        if (req.getNomCourt() != null)         fed.setNomCourt(req.getNomCourt());
        if (req.getPays() != null)             fed.setPays(req.getPays());
        if (req.getDevise() != null)           fed.setDevise(req.getDevise());
        if (req.getLangueOfficielle() != null) fed.setLangueOfficielle(req.getLangueOfficielle());
        if (req.getTelephone() != null)        fed.setTelephone(req.getTelephone());
        if (req.getEmailContact() != null)     fed.setEmailContact(req.getEmailContact());
        if (req.getSiteWeb() != null)          fed.setSiteWeb(req.getSiteWeb());
        if (req.getAdresse() != null)          fed.setAdresse(req.getAdresse());
        if (req.getUrlLogo() != null)          fed.setUrlLogo(req.getUrlLogo());
        if (req.getAnneeFondation() != null)   fed.setAnneeFondation(req.getAnneeFondation());

        fed.setDateMiseAJour(LocalDateTime.now());
        return toResponse(federationRepository.save(fed));
    }

    // ─────────────────────────────────────────
    // --- Partenaires fédéraux (club = null) ---
    // ─────────────────────────────────────────

    // ✅ Partenaires fédéraux = ceux sans club associé
    public List<PartenaireResponse> getPartenaires() {
        return partenaireRepository.findAll().stream()
                .filter(p -> p.getClub() == null)
                .map(this::toPartenaireResponse)
                .toList();
    }

    public PartenaireResponse addPartenaire(PartenaireRequest req) {
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
                .club(null) // ✅ fédéral = pas de club
                .build();
        return toPartenaireResponse(partenaireRepository.save(partenaire));
    }

    public PartenaireResponse updatePartenaire(String id, PartenaireRequest req) {
        Partenaire partenaire = partenaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partenaire introuvable"));

        // ✅ Sécurité : on ne touche qu'aux partenaires fédéraux
        if (partenaire.getClub() != null) {
            throw new RuntimeException("Ce partenaire appartient à un club.");
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

        // ✅ Sécurité : on ne supprime que les partenaires fédéraux
        if (partenaire.getClub() != null) {
            throw new RuntimeException("Ce partenaire appartient à un club.");
        }

        partenaireRepository.delete(partenaire);
    }

    // ─────────────────────────────────────────
    // --- Mappers ---
    // ─────────────────────────────────────────

    private FederationResponse toResponse(Federation f) {
        return FederationResponse.builder()
                .id(f.getId()).nom(f.getNom()).nomCourt(f.getNomCourt())
                .pays(f.getPays()).devise(f.getDevise())
                .langueOfficielle(f.getLangueOfficielle())
                .telephone(f.getTelephone()).emailContact(f.getEmailContact())
                .siteWeb(f.getSiteWeb()).adresse(f.getAdresse())
                .urlLogo(f.getUrlLogo()).statut(f.getStatut().name())
                .anneeFondation(f.getAnneeFondation())
                .dateCreation(f.getDateCreation())
                .dateMiseAJour(f.getDateMiseAJour())
                .build();
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
                .statut(p.getStatut() != null ? p.getStatut().name() : null)
                .actif(p.isActif())
                .build();
    }
}