package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Actualite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActualiteRepository extends JpaRepository<Actualite, String> {
    List<Actualite> findByClubId(String clubId);
    List<Actualite> findByClubIsNull(); // For federation news
}
