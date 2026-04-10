package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Personne;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PersonneRepository extends JpaRepository<Personne, String> {

    List<Personne> findByClub_Id(String clubId);
    Optional<Personne> findByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM personnes WHERE club_id = :clubId", nativeQuery = true)
    void deleteAllByClubId(@Param("clubId") String clubId);
}