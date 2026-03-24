package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Saison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SaisonRepository extends JpaRepository<Saison, String> {
    List<Saison> findAllByOrderByDateCreationDesc();
    Optional<Saison> findByActiveTrue();
}