package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.model.entity.*;
import com.example.pfegestionsportive.model.enums.TeamCategory;
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
public class EquipeService {

    private final EquipeRepository equipeRepository;
    private final ClubRepository clubRepository;

    @Transactional(readOnly = true)
    public List<Equipe> getAll() {
        return equipeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Equipe getById(UUID id) {
        return equipeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Équipe introuvable : " + id));
    }

    public Equipe create(UUID clubId, Equipe equipe) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new EntityNotFoundException("Club introuvable : " + clubId));
        equipe.setClub(club);
        return equipeRepository.save(equipe);
    }

    public Equipe update(UUID id, Equipe updated) {
        Equipe existing = getById(id);
        existing.setNom(updated.getNom());
        existing.setCategorie(updated.getCategorie());
        existing.setGenre(updated.getGenre());
        existing.setTrancheAge(updated.getTrancheAge());
        existing.setSaison(updated.getSaison());
        return equipeRepository.save(existing);
    }

    public void delete(UUID id) {
        equipeRepository.delete(getById(id));
    }

    @Transactional(readOnly = true)
    public List<Equipe> getByClub(UUID clubId) {
        return equipeRepository.findByClubId(clubId);
    }

    @Transactional(readOnly = true)
    public List<Equipe> getByCategorie(TeamCategory categorie) {
        return equipeRepository.findByCategorie(categorie);
    }

    @Transactional(readOnly = true)
    public List<AffectationEquipe> getRoster(UUID equipeId) {
        Equipe equipe = getById(equipeId);
        return equipe.getAffectations();
    }

    @Transactional(readOnly = true)
    public List<Match> getMatchsDomicile(UUID equipeId) {
        return getById(equipeId).getMatchsDomicile();
    }

    @Transactional(readOnly = true)
    public List<Match> getMatchsExterieur(UUID equipeId) {
        return getById(equipeId).getMatchsExterieur();
    }
}