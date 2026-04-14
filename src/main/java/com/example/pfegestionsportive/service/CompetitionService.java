package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.CompetitionRequest;
import com.example.pfegestionsportive.dto.response.CompetitionResponse;
import com.example.pfegestionsportive.model.entity.Competition;
import com.example.pfegestionsportive.repository.CompetitionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompetitionService {

    private final CompetitionRepository competitionRepository;

    // ✅ Créer une compétition avec tous les nouveaux champs
    public CompetitionResponse create(CompetitionRequest req) {
        Competition c = Competition.builder()
                .nom(req.getNom())
                .description(req.getDescription())
                .saison(req.getSaison())               // ✨ String direct mel front
                .nombreEquipes(req.getNombreEquipes())
                .dateDebut(req.getDateDebut())         // ✨ Champ jdid
                .dateFin(req.getDateFin())             // ✨ Champ jdid
                .categorie(req.getCategorie())
                .typeRugby(req.getTypeRugby())         // ✨ Enum jdid
                .categorieAge(req.getCategorieAge())   // ✨ Enum jdid
                .niveau(req.getNiveau())
                .genre(req.getGenre())                 // ✨ Enum jdid
                .active(req.isActive())
                .build();

        return toResponse(competitionRepository.save(c));
    }

    // ✅ Récupérer toutes les compétitions
    public List<CompetitionResponse> getAll() {
        return competitionRepository.findAllByOrderByDateCreationDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ✅ Récupérer par ID
    public CompetitionResponse getById(String id) {
        return toResponse(findById(id));
    }

    // ✅ Mettre à jour une compétition
    public CompetitionResponse update(String id, CompetitionRequest req) {
        Competition c = findById(id);

        c.setNom(req.getNom());
        c.setCategorie(req.getCategorie());
        c.setTypeRugby(req.getTypeRugby());
        c.setCategorieAge(req.getCategorieAge());
        c.setNiveau(req.getNiveau());
        c.setGenre(req.getGenre());
        c.setSaison(req.getSaison());
        c.setDescription(req.getDescription());
        c.setNombreEquipes(req.getNombreEquipes());
        c.setDateDebut(req.getDateDebut());
        c.setDateFin(req.getDateFin());
        c.setActive(req.isActive());

        return toResponse(competitionRepository.save(c));
    }

    // ✅ Supprimer une compétition
    public void delete(String id) {
        competitionRepository.delete(findById(id));
    }

    // Helper: Trouver l'entité ou Error 404
    private Competition findById(String id) {
        return competitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compétition introuvable"));
    }

    // ✅ Mapping Entity -> Response DTO
    private CompetitionResponse toResponse(Competition c) {
        return CompetitionResponse.builder()
                .id(c.getId())
                .nom(c.getNom())
                .description(c.getDescription())
                .saison(c.getSaison())                // ✨ Retourne le string "2025-2026"
                .nombreEquipes(c.getNombreEquipes())
                .dateDebut(c.getDateDebut())
                .dateFin(c.getDateFin())
                .active(c.isActive())
                .categorie(c.getCategorie() != null ? c.getCategorie().name() : null)
                .typeRugby(c.getTypeRugby() != null ? c.getTypeRugby().name() : null)
                .categorieAge(c.getCategorieAge() != null ? c.getCategorieAge().name() : null)
                .niveau(c.getNiveau() != null ? c.getNiveau().name() : null)
                .genre(c.getGenre() != null ? c.getGenre().name() : null)
                .dateCreation(c.getDateCreation())
                .build();
    }
}