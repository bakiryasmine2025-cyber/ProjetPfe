package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.model.entity.*;
import com.example.pfegestionsportive.model.enums.TeamRole;
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
public class AffectationEquipeService {

    private final AffectationEquipeRepository affectationRepository;
    private final EquipeRepository equipeRepository;
    private final PersonneRepository personneRepository;

    @Transactional(readOnly = true)
    public List<AffectationEquipe> getByEquipe(UUID equipeId) {
        return affectationRepository.findByEquipeId(equipeId);
    }

    @Transactional(readOnly = true)
    public List<AffectationEquipe> getByPersonne(UUID personneId) {
        return affectationRepository.findByPersonneId(personneId);
    }

    @Transactional(readOnly = true)
    public List<AffectationEquipe> getByRole(UUID equipeId, TeamRole role) {
        return affectationRepository.findByEquipeIdAndRole(equipeId, role);
    }

    public AffectationEquipe affecter(UUID equipeId, UUID personneId, TeamRole role, Integer numMaillot) {
        if (affectationRepository.existsByEquipeIdAndPersonneId(equipeId, personneId))
            throw new IllegalArgumentException("Cette personne est déjà affectée à cette équipe");

        Equipe equipe = equipeRepository.findById(equipeId)
                .orElseThrow(() -> new EntityNotFoundException("Équipe introuvable : " + equipeId));
        Personne personne = personneRepository.findById(personneId)
                .orElseThrow(() -> new EntityNotFoundException("Personne introuvable : " + personneId));

        AffectationEquipe affectation = AffectationEquipe.builder()
                .equipe(equipe)
                .personne(personne)
                .role(role)
                .numMaillot(numMaillot)
                .build();

        return affectationRepository.save(affectation);
    }

    public AffectationEquipe updateRole(UUID equipeId, UUID personneId, TeamRole newRole) {
        AffectationEquipe aff = affectationRepository
                .findByEquipeIdAndPersonneId(equipeId, personneId)
                .orElseThrow(() -> new EntityNotFoundException("Affectation introuvable"));
        aff.setRole(newRole);
        return affectationRepository.save(aff);
    }

    public void retirer(UUID equipeId, UUID personneId) {
        if (!affectationRepository.existsByEquipeIdAndPersonneId(equipeId, personneId))
            throw new EntityNotFoundException("Affectation introuvable");
        affectationRepository.deleteByEquipeIdAndPersonneId(equipeId, personneId);
    }
}
