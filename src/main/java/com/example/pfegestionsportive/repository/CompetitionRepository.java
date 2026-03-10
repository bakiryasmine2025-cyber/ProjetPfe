package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Competition;
import com.example.pfegestionsportive.model.enums.CompetitionCategory;
import com.example.pfegestionsportive.model.enums.CompetitionLevel;
import com.example.pfegestionsportive.model.enums.Gender;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CompetitionRepository extends JpaRepository<Competition, UUID> {
    List<Competition> findBySaison(String saison);
    List<Competition> findByCategorie(CompetitionCategory categorie);
    List<Competition> findByNiveau(CompetitionLevel niveau);
    List<Competition> findByGenre(Gender genre);
    List<Competition> findByFederationId(UUID federationId);
    List<Competition> findBySaisonAndCategorie(String saison, CompetitionCategory categorie);
    boolean existsByNomAndSaison(String nom, String saison);
}
