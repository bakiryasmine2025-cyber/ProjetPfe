package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, String> {
    
    // Find all matches where a given team is playing (either home or away)
    @Query("SELECT m FROM Match m WHERE m.equipeDomicile.id = :equipeId OR m.equipeExterieur.id = :equipeId")
    List<Match> findByEquipeId(@Param("equipeId") String equipeId);

    // Find all matches for a club (all teams)
    @Query("SELECT m FROM Match m WHERE m.equipeDomicile.club.id = :clubId OR m.equipeExterieur.club.id = :clubId")
    List<Match> findByClubId(@Param("clubId") String clubId);
}
