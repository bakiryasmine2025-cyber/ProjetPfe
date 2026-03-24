package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.CommandeRequest;
import com.example.pfegestionsportive.dto.request.TicketRequest;
import com.example.pfegestionsportive.dto.response.CommandeResponse;
import com.example.pfegestionsportive.dto.response.ProduitResponse;
import com.example.pfegestionsportive.dto.response.TicketResponse;
import com.example.pfegestionsportive.service.EcommerceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shop")
@RequiredArgsConstructor
public class EcommerceController {

    private final EcommerceService ecommerceService;

    // ── Produits ──
    @GetMapping("/produits")
    public ResponseEntity<List<ProduitResponse>> getProduits() {
        return ResponseEntity.ok(ecommerceService.getAllProduits());
    }

    // ── Commandes ──
    @PostMapping("/commandes")
    public ResponseEntity<CommandeResponse> passerCommande(@RequestBody CommandeRequest req) {
        return ResponseEntity.ok(ecommerceService.passerCommande(req));
    }

    @GetMapping("/commandes")
    public ResponseEntity<List<CommandeResponse>> getMesCommandes() {
        return ResponseEntity.ok(ecommerceService.getMesCommandes());
    }

    // ── Tickets ──
    @PostMapping("/tickets")
    public ResponseEntity<TicketResponse> acheterTicket(@RequestBody TicketRequest req) {
        return ResponseEntity.ok(ecommerceService.acheterTicket(req));
    }

    @GetMapping("/tickets")
    public ResponseEntity<List<TicketResponse>> getMesTickets() {
        return ResponseEntity.ok(ecommerceService.getMesTickets());
    }
}
