package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, String> {

    // Tous les tickets d'un user
    List<Ticket> findByUserId(String userId);

    // Tous les tickets d'un match
    List<Ticket> findByMatchId(String matchId);

    // Chercher par QR code (validation entrée)
    Optional<Ticket> findByCodeTicket(String codeTicket);

    // Compter les tickets actifs d'un match (pour vérifier capacité)
    long countByMatchIdAndStatutNot(String matchId, String statut);
}