package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Club;
import com.example.pfegestionsportive.model.enums.ClubStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClubRepository extends JpaRepository<Club, String> {
    List<Club> findAllByOrderByDateCreationDesc();
    List<Club> findByStatut(ClubStatus statut);
    boolean existsByNom(String nom);
}