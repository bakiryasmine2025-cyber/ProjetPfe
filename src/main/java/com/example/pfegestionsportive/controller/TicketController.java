package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.TicketRequest;
import com.example.pfegestionsportive.dto.response.TicketResponse;
import com.example.pfegestionsportive.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    // ─── Acheter un ticket (Fan / User connecté) ──────────────────────
    // POST /api/tickets/acheter
    // Body: { "matchId": "...", "categorie": "VIP" }
    @PostMapping("/acheter")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketResponse> acheterTicket(
            @Valid @RequestBody TicketRequest request) {
        return ResponseEntity.ok(ticketService.acheterTicket(request));
    }

    // ─── Mes tickets (User connecté) ──────────────────────────────────
    // GET /api/tickets/mes-tickets
    @GetMapping("/mes-tickets")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TicketResponse>> getMesTickets() {
        return ResponseEntity.ok(ticketService.getMesTickets());
    }

    // ─── Tickets par match (Admin) ────────────────────────────────────
    // GET /api/tickets/match/{matchId}
    @GetMapping("/match/{matchId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FEDERATION_ADMIN')")
    public ResponseEntity<List<TicketResponse>> getTicketsByMatch(
            @PathVariable String matchId) {
        return ResponseEntity.ok(ticketService.getTicketsByMatch(matchId));
    }

    // ─── Valider QR Code à l'entrée ───────────────────────────────────
    // POST /api/tickets/valider-qr?code=xxxxxxxx
    @PostMapping("/valider-qr")
    @PreAuthorize("hasAnyRole('ADMIN', 'FEDERATION_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<TicketResponse> validerQRCode(
            @RequestParam String code) {
        return ResponseEntity.ok(ticketService.validerQRCode(code));
    }

    // ─── Annuler un ticket ────────────────────────────────────────────
    // PUT /api/tickets/{id}/annuler
    @PutMapping("/{id}/annuler")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketResponse> annulerTicket(
            @PathVariable String id) {
        return ResponseEntity.ok(ticketService.annulerTicket(id));
    }
}
