package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.PartenaireRequest;
import com.example.pfegestionsportive.dto.response.PartenaireResponse;
import com.example.pfegestionsportive.model.entity.Partenaire;
import com.example.pfegestionsportive.repository.PartenaireRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PartenaireService {

    private final PartenaireRepository partenaireRepository;

    // ✅ Créer un nouveau partenaire
    public PartenaireResponse create(PartenaireRequest req) {
        Partenaire p = Partenaire.builder()
                .nom(req.getNom())
                .type(req.getType())
                .secteur(req.getSecteur())
                .emailContact(req.getEmailContact())
                .urlLogo(req.getUrlLogo())
                .siteWeb(req.getSiteWeb())
                .dateDebutContrat(req.getDateDebutContrat())
                .dateFinContrat(req.getDateFinContrat())
                .montant(req.getMontant()) // <--- Montant pour Power BI
                .actif(req.isActif())
                .build();
        return toResponse(partenaireRepository.save(p));
    }

    // ✅ Récupérer tous les partenaires (Triés par date de création)
    public List<PartenaireResponse> getAll() {
        return partenaireRepository.findAllByOrderByDateCreationDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ✅ Récupérer un partenaire par ID
    public PartenaireResponse getById(String id) {
        return toResponse(findById(id));
    }

    // ✅ Mettre à jour un partenaire
    public PartenaireResponse update(String id, PartenaireRequest req) {
        Partenaire p = findById(id);

        if (req.getNom() != null) p.setNom(req.getNom());
        if (req.getType() != null) p.setType(req.getType());
        if (req.getSecteur() != null) p.setSecteur(req.getSecteur());
        if (req.getEmailContact() != null) p.setEmailContact(req.getEmailContact());
        if (req.getUrlLogo() != null) p.setUrlLogo(req.getUrlLogo());
        if (req.getSiteWeb() != null) p.setSiteWeb(req.getSiteWeb());
        if (req.getDateDebutContrat() != null) p.setDateDebutContrat(req.getDateDebutContrat());
        if (req.getDateFinContrat() != null) p.setDateFinContrat(req.getDateFinContrat());

        // ✅ Mise à jour du montant
        if (req.getMontant() != null) p.setMontant(req.getMontant());

        p.setActif(req.isActif());

        return toResponse(partenaireRepository.save(p));
    }

    // ✅ Supprimer un partenaire
    public void delete(String id) {
        partenaireRepository.delete(findById(id));
    }

    // ✅ Méthode interne pour trouver l'entité ou lancer une erreur
    private Partenaire findById(String id) {
        return partenaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partenaire introuvable avec l'ID: " + id));
    }

    // ✅ Mapper: Transformer Entity -> DTO Response
    private PartenaireResponse toResponse(Partenaire p) {
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
                .montant(p.getMontant()) // <--- Retourner le montant au Frontend
                .actif(p.isActif())
                .dateCreation(p.getDateCreation())
                .statut(determineStatut(p)) // Optionnel: pour afficher si le contrat est fini
                .build();
    }

    // Petit bonus pour ton dashboard : calculer le statut selon la date
    private String determineStatut(Partenaire p) {
        if (p.getDateFinContrat() != null && p.getDateFinContrat().isBefore(java.time.LocalDate.now())) {
            return "EXPIRE";
        }
        return p.isActif() ? "ACTIF" : "INACTIF";
    }
}