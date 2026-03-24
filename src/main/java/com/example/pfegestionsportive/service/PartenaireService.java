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

    // ✅ 3.4 - CRUD Partenaires
    public PartenaireResponse create(PartenaireRequest req) {
        Partenaire p = Partenaire.builder()
                .nom(req.getNom()).type(req.getType())
                .secteur(req.getSecteur()).emailContact(req.getEmailContact())
                .urlLogo(req.getUrlLogo()).siteWeb(req.getSiteWeb())
                .dateDebutContrat(req.getDateDebutContrat())
                .dateFinContrat(req.getDateFinContrat())
                .actif(req.isActif())
                .build();
        return toResponse(partenaireRepository.save(p));
    }

    public List<PartenaireResponse> getAll() {
        return partenaireRepository.findAllByOrderByDateCreationDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public PartenaireResponse getById(String id) {
        return toResponse(findById(id));
    }

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
        p.setActif(req.isActif());
        return toResponse(partenaireRepository.save(p));
    }

    public void delete(String id) {
        partenaireRepository.delete(findById(id));
    }

    private Partenaire findById(String id) {
        return partenaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partenaire introuvable"));
    }

    private PartenaireResponse toResponse(Partenaire p) {
        return PartenaireResponse.builder()
                .id(p.getId()).nom(p.getNom())
                .type(p.getType() != null ? p.getType().name() : null)
                .secteur(p.getSecteur()).emailContact(p.getEmailContact())
                .urlLogo(p.getUrlLogo()).siteWeb(p.getSiteWeb())
                .dateDebutContrat(p.getDateDebutContrat())
                .dateFinContrat(p.getDateFinContrat())
                .actif(p.isActif()).dateCreation(p.getDateCreation())
                .build();
    }
}
