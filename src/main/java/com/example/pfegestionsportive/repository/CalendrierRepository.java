package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Calendrier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CalendrierRepository extends JpaRepository<Calendrier, UUID> {
    List<Calendrier> findBySaison(String saison);
    List<Calendrier> findByCompetitionId(UUID competitionId);
}