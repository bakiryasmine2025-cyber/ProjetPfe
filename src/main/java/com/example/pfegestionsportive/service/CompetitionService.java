package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.model.entity.*;
import com.example.pfegestionsportive.model.enums.CompetitionCategory;
import com.example.pfegestionsportive.model.enums.CompetitionLevel;
import com.example.pfegestionsportive.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CompetitionService {

    private final CompetitionRepository competitionRepository;
    private final FederationRepository federationRepository;

    @Transactional(readOnly = true)
    public List<Competition> getAll() {
        return competitionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Competition getById(UUID id) {
        return competitionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Compétition introuvable : " + id));
    }

    public Competition create(UUID federationId, Competition competition) {
        Federation federation = federationRepository.findById(federationId)
                .orElseThrow(() -> new EntityNotFoundException("Fédération introuvable : " + federationId));
        competition.setFederation(federation);
        return competitionRepository.save(competition);
    }

    public Competition update(UUID id, Competition updated) {
        Competition existing = getById(id);
        existing.setNom(updated.getNom());
        existing.setSaison(updated.getSaison());
        existing.setCategorie(updated.getCategorie());
        existing.setGenre(updated.getGenre());
        existing.setNiveau(updated.getNiveau());
        return competitionRepository.save(existing);
    }

    public void delete(UUID id) {
        competitionRepository.delete(getById(id));
    }

    @Transactional(readOnly = true)
    public List<Competition> getByNiveau(CompetitionLevel niveau) {
        return competitionRepository.findByNiveau(niveau);
    }

    @Transactional(readOnly = true)
    public List<Competition> getByCategorie(CompetitionCategory categorie) {
        return competitionRepository.findByCategorie(categorie);
    }

    @Transactional(readOnly = true)
    public List<Match> getMatchs(UUID id) {
        return getById(id).getMatchs();
    }

    @Transactional(readOnly = true)
    public List<Licence> getLicences(UUID id) {
        return getById(id).getLicences();
    }

    @Transactional(readOnly = true)
    public Calendrier getCalendrier(UUID id) {
        return getById(id).getCalendrier();
    }

    public Competition cloturerSaison(UUID id) {
        Competition competition = getById(id);
        competition.setSaison(competition.getSaison() + " [CLÔTURÉE]");
        return competitionRepository.save(competition);
    }
}