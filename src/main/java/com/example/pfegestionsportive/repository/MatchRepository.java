package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Match;
import com.example.pfegestionsportive.model.enums.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, String> {

    List<Match> findByCompetitionIdOrderByDateMatchAsc(String competitionId);

    List<Match> findAllByOrderByDateMatchAsc();

    List<Match> findByStatut(MatchStatus statut);

    // ✅ Fix: utiliser equipeDomicile.id et equipeExterieur.id
    @Query("SELECT m FROM Match m WHERE " +
            "(m.equipeDomicile.id = :clubId OR m.equipeExterieur.id = :clubId) AND " +
            "m.statut != 'ANNULE' AND " +
            "m.dateMatch BETWEEN :debut AND :fin")
    List<Match> findConflits(
            @Param("clubId") String clubId,
            @Param("debut") LocalDateTime debut,
            @Param("fin") LocalDateTime fin);

    // ✅ Trouver tous les matchs d'un club
    @Query("SELECT m FROM Match m WHERE " +
            "m.equipeDomicile.id = :clubId OR m.equipeExterieur.id = :clubId " +
            "ORDER BY m.dateMatch DESC")
    List<Match> findByClub(@Param("clubId") String clubId);

}