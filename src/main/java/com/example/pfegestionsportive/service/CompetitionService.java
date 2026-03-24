package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.CompetitionRequest;
import com.example.pfegestionsportive.dto.response.CompetitionResponse;
import com.example.pfegestionsportive.model.entity.Competition;
import com.example.pfegestionsportive.model.entity.Saison;
import com.example.pfegestionsportive.repository.CompetitionRepository;
import com.example.pfegestionsportive.repository.SaisonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompetitionService {

    private final CompetitionRepository competitionRepository;
    private final SaisonRepository saisonRepository;

    // ✅ 3.3 - Créer compétition
    public CompetitionResponse create(CompetitionRequest req) {
        Saison saison = null;
        if (req.getSaisonId() != null)
            saison = saisonRepository.findById(req.getSaisonId()).orElse(null);

        Competition c = Competition.builder()
                .nom(req.getNom())
                .categorie(req.getCategorie())
                .niveau(req.getNiveau())
                .saison(saison)
                .description(req.getDescription())
                .nombreEquipes(req.getNombreEquipes())
                .active(req.isActive())
                .build();

        return toResponse(competitionRepository.save(c));
    }

    public List<CompetitionResponse> getAll() {
        return competitionRepository.findAllByOrderByDateCreationDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CompetitionResponse getById(String id) {
        return toResponse(findById(id));
    }

    public CompetitionResponse update(String id, CompetitionRequest req) {
        Competition c = findById(id);
        if (req.getNom() != null) c.setNom(req.getNom());
        if (req.getCategorie() != null) c.setCategorie(req.getCategorie());
        if (req.getNiveau() != null) c.setNiveau(req.getNiveau());
        if (req.getDescription() != null) c.setDescription(req.getDescription());
        if (req.getNombreEquipes() != null) c.setNombreEquipes(req.getNombreEquipes());
        c.setActive(req.isActive());
        if (req.getSaisonId() != null)
            saisonRepository.findById(req.getSaisonId()).ifPresent(c::setSaison);
        return toResponse(competitionRepository.save(c));
    }

    public void delete(String id) {
        competitionRepository.delete(findById(id));
    }

    private Competition findById(String id) {
        return competitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compétition introuvable"));
    }

    private CompetitionResponse toResponse(Competition c) {
        return CompetitionResponse.builder()
                .id(c.getId()).nom(c.getNom())
                .categorie(c.getCategorie() != null ? c.getCategorie().name() : null)
                .niveau(c.getNiveau() != null ? c.getNiveau().name() : null)
                .saisonId(c.getSaison() != null ? c.getSaison().getId() : null)
                .saisonNom(c.getSaison() != null ? c.getSaison().getNom() : null)
                .description(c.getDescription())
                .nombreEquipes(c.getNombreEquipes())
                .active(c.isActive())
                .dateCreation(c.getDateCreation())
                .build();
    }
}
