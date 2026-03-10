package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.AffectationEquipe;
import com.example.pfegestionsportive.model.enums.TeamRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AffectationEquipeRepository extends JpaRepository<AffectationEquipe, UUID> {
    List<AffectationEquipe> findByEquipeId(UUID equipeId);
    List<AffectationEquipe> findByPersonneId(UUID personneId);
    Optional<AffectationEquipe> findByEquipeIdAndPersonneId(UUID equipeId, UUID personneId);
    void deleteByEquipeIdAndPersonneId(UUID equipeId, UUID personneId);
    List<AffectationEquipe> findByEquipeIdAndRole(UUID equipeId, TeamRole role);
    boolean existsByEquipeIdAndPersonneId(UUID equipeId, UUID personneId);
}
