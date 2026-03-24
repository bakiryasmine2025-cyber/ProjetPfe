package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Competition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CompetitionRepository extends JpaRepository<Competition, String> {
    List<Competition> findAllByOrderByDateCreationDesc();
    List<Competition> findBySaisonId(String saisonId);
    List<Competition> findByActiveTrue();
}
