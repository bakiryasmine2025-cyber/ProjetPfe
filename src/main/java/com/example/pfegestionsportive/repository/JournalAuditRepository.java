package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.JournalAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface JournalAuditRepository extends JpaRepository<JournalAudit, UUID> {

    List<JournalAudit> findByUtilisateurId(UUID utilisateurId);

    List<JournalAudit> findByAction(String action);

    List<JournalAudit> findAllByOrderByDateActionDesc();

    @Query("SELECT j FROM JournalAudit j WHERE " +
            "j.dateAction BETWEEN :debut AND :fin " +
            "ORDER BY j.dateAction DESC")
    List<JournalAudit> findByDateActionBetween(
            @Param("debut") LocalDateTime debut,
            @Param("fin") LocalDateTime fin
    );

    @Query("SELECT j FROM JournalAudit j WHERE " +
            "j.utilisateur.id = :userId " +
            "ORDER BY j.dateAction DESC")
    List<JournalAudit> findByUtilisateurIdOrderByDateDesc(
            @Param("userId") UUID userId
    );
}