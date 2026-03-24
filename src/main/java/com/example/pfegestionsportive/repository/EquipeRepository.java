package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Equipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipeRepository extends JpaRepository<Equipe, String> {
    List<Equipe> findByClubId(String clubId);
}
