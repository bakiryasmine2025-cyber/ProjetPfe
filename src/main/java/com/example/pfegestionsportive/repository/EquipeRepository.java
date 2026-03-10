package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Equipe;
import com.example.pfegestionsportive.model.enums.TeamCategory;
import com.example.pfegestionsportive.model.enums.Gender;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EquipeRepository extends JpaRepository<Equipe, UUID> {
    List<Equipe> findByClubId(UUID clubId);
    List<Equipe> findByCategorie(TeamCategory categorie);
    List<Equipe> findBySaison(String saison);
    List<Equipe> findByGenre(Gender genre);
    List<Equipe> findByClubIdAndSaison(UUID clubId, String saison);
    boolean existsByNomAndClubId(String nom, UUID clubId);
}
