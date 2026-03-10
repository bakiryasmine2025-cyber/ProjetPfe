package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.ProfilArbitre;
import com.example.pfegestionsportive.model.enums.Refereelevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfilArbitreRepository extends JpaRepository<ProfilArbitre, UUID> {
    Optional<ProfilArbitre> findByPersonneId(UUID personneId);
    List<ProfilArbitre> findByNiveau(Refereelevel niveau);
    List<ProfilArbitre> findByDisponibilite(Boolean disponibilite);
    boolean existsByPersonneId(UUID personneId);
}