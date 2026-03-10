package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Match;
import com.example.pfegestionsportive.model.enums.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MatchRepository extends JpaRepository<Match, UUID> {


    List<Match> findByEquipeDomicileIdOrEquipeExterieurId(UUID equipeId1, UUID equipeId2);

    List<Match> findByCompetitionId(UUID competitionId);

    List<Match> findByStatut(MatchStatus statut);
}