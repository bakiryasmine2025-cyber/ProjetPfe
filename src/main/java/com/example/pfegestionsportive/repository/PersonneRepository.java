package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Personne;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PersonneRepository extends JpaRepository<Personne, String> {
    List<Personne> findByClub_Id(String clubId);
    Optional<Personne> findByEmail(String email);
}
