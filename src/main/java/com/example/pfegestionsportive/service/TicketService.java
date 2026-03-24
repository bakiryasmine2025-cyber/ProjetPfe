package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.TicketRequest;
import com.example.pfegestionsportive.dto.response.TicketResponse;
import com.example.pfegestionsportive.model.entity.Match;
import com.example.pfegestionsportive.model.entity.Ticket;
import com.example.pfegestionsportive.model.entity.User;
import com.example.pfegestionsportive.repository.MatchRepository;
import com.example.pfegestionsportive.repository.TicketRepository;
import com.example.pfegestionsportive.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository  ticketRepository;
    private final MatchRepository   matchRepository;
    private final UserRepository    userRepository;
    private final QRCodeService     qrCodeService;   // ← injection du service QR

    private static final int CAPACITE_MAX_DEFAULT = 500;

    // ─── Prix par catégorie ───────────────────────────────────────────
    private BigDecimal getPrixByCategorie(String categorie) {
        return switch (categorie.toUpperCase()) {
            case "VIP"              -> new BigDecimal("80.00");
            case "TRIBUNE"          -> new BigDecimal("30.00");
            case "TRIBUNE CENTRALE" -> new BigDecimal("25.00");
            case "PELOUSE"          -> new BigDecimal("15.00");
            case "VIRAGE"           -> new BigDecimal("10.00");
            default -> throw new RuntimeException("Catégorie invalide: " + categorie);
        };
    }

    // ─── Nom match depuis équipes ─────────────────────────────────────
    private String getMatchNom(Match match) {
        String dom = (match.getEquipeDomicile() != null && match.getEquipeDomicile().getNom() != null)
                ? match.getEquipeDomicile().getNom() : "Equipe A";
        String ext = (match.getEquipeExterieur() != null && match.getEquipeExterieur().getNom() != null)
                ? match.getEquipeExterieur().getNom() : "Equipe B";
        return dom + " vs " + ext;
    }

    // ─── Acheter un ticket ────────────────────────────────────────────
    @Transactional
    public TicketResponse acheterTicket(TicketRequest request) {

        Match match = matchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match introuvable"));

        long ticketsVendus = ticketRepository.countByMatchIdAndStatutNot(match.getId(), "ANNULE");
        if (ticketsVendus >= CAPACITE_MAX_DEFAULT) {
            throw new RuntimeException("Plus de places disponibles pour ce match");
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // @PrePersist génère codeTicket (UUID) + statut RESERVE + dateAchat
        Ticket ticket = Ticket.builder()
                .match(match)
                .user(user)
                .categorie(request.getCategorie().toUpperCase())
                .prix(getPrixByCategorie(request.getCategorie()))
                .build();

        Ticket saved = ticketRepository.save(ticket);
        return toResponse(saved);
    }

    // ─── Mes tickets ──────────────────────────────────────────────────
    public List<TicketResponse> getMesTickets() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        return ticketRepository.findByUserId(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ─── Tickets par match (admin) ────────────────────────────────────
    public List<TicketResponse> getTicketsByMatch(String matchId) {
        return ticketRepository.findByMatchId(matchId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ─── Valider QR Code à l'entrée ───────────────────────────────────
    @Transactional
    public TicketResponse validerQRCode(String codeTicket) {
        Ticket ticket = ticketRepository.findByCodeTicket(codeTicket)
                .orElseThrow(() -> new RuntimeException("QR Code invalide"));

        if ("UTILISE".equals(ticket.getStatut()))
            throw new RuntimeException("Ce ticket a déjà été utilisé");
        if ("ANNULE".equals(ticket.getStatut()))
            throw new RuntimeException("Ce ticket est annulé");

        ticket.setStatut("UTILISE");
        ticket.setDateValidation(LocalDateTime.now());
        return toResponse(ticketRepository.save(ticket));
    }

    // ─── Annuler un ticket ────────────────────────────────────────────
    @Transactional
    public TicketResponse annulerTicket(String ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket introuvable"));

        if ("UTILISE".equals(ticket.getStatut()))
            throw new RuntimeException("Impossible d'annuler un ticket déjà utilisé");

        ticket.setStatut("ANNULE");
        return toResponse(ticketRepository.save(ticket));
    }

    // ─── Mapper entity → DTO (avec QR Code réel généré) ──────────────
    private TicketResponse toResponse(Ticket ticket) {
        Match match = ticket.getMatch();

        // Génération QR Code réel en Base64 PNG depuis le codeTicket UUID
        String qrCodeImage = qrCodeService.generateQRCodeBase64(ticket.getCodeTicket());

        return TicketResponse.builder()
                .id(ticket.getId())
                .matchNom(getMatchNom(match))
                .matchDate(match.getDateMatch() != null ? match.getDateMatch().toString() : "")
                .stade(match.getLieu() != null ? match.getLieu() : "")
                .categorie(ticket.getCategorie())
                .prix(ticket.getPrix())
                .statut(ticket.getStatut())
                .codeTicket(ticket.getCodeTicket())
                .qrCodeImage(qrCodeImage)
                .dateAchat(ticket.getDateAchat())
                .build();
    }
}