package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.CommandeRequest;
import com.example.pfegestionsportive.dto.request.TicketRequest;
import com.example.pfegestionsportive.dto.response.CommandeResponse;
import com.example.pfegestionsportive.dto.response.ProduitResponse;
import com.example.pfegestionsportive.dto.response.TicketResponse;
import com.example.pfegestionsportive.model.entity.*;
import com.example.pfegestionsportive.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EcommerceService {

    private final ProduitRepository produitRepository;
    private final CommandeRepository commandeRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final MatchRepository matchRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    // ── Produits ──
    public List<ProduitResponse> getAllProduits() {
        return produitRepository.findByDisponibleTrue().stream()
                .map(this::toProduitResponse)
                .collect(Collectors.toList());
    }

    // ── Commandes ──
    @Transactional
    public CommandeResponse passerCommande(CommandeRequest req) {
        User user = getCurrentUser();

        List<LigneCommande> lignes = req.getLignes().stream().map(l -> {
            Produit produit = produitRepository.findById(l.getProduitId())
                    .orElseThrow(() -> new RuntimeException("Produit introuvable"));
            return LigneCommande.builder()
                    .produit(produit)
                    .quantite(l.getQuantite())
                    .prixUnitaire(produit.getPrix())
                    .build();
        }).collect(Collectors.toList());

        BigDecimal total = lignes.stream()
                .map(l -> l.getPrixUnitaire().multiply(BigDecimal.valueOf(l.getQuantite())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Commande commande = Commande.builder()
                .user(user)
                .lignes(lignes)
                .montantTotal(total)
                .statut("CONFIRMEE")
                .adresseLivraison(req.getAdresseLivraison())
                .dateCommande(LocalDateTime.now())
                .build();

        lignes.forEach(l -> l.setCommande(commande));
        commandeRepository.save(commande);
        return toCommandeResponse(commande);
    }

    public List<CommandeResponse> getMesCommandes() {
        User user = getCurrentUser();
        return commandeRepository.findByUserId(user.getId()).stream()
                .map(this::toCommandeResponse)
                .collect(Collectors.toList());
    }

    // ── Tickets ──
    @Transactional
    public TicketResponse acheterTicket(TicketRequest req) {
        User user = getCurrentUser();
        Match match = matchRepository.findById(req.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match introuvable"));

        BigDecimal prix = switch (req.getCategorie()) {
            case "VIP" -> BigDecimal.valueOf(50);
            case "TRIBUNE" -> BigDecimal.valueOf(20);
            default -> BigDecimal.valueOf(10);
        };

        Ticket ticket = Ticket.builder()
                .user(user)
                .match(match)
                .categorie(req.getCategorie())
                .prix(prix)
                .statut("PAYE")
                .codeTicket("TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .dateAchat(LocalDateTime.now())
                .build();

        ticketRepository.save(ticket);
        return toTicketResponse(ticket);
    }

    public List<TicketResponse> getMesTickets() {
        User user = getCurrentUser();
        return ticketRepository.findByUserId(user.getId()).stream()
                .map(this::toTicketResponse)
                .collect(Collectors.toList());
    }

    // ── Mappers ──
    private ProduitResponse toProduitResponse(Produit p) {
        return ProduitResponse.builder()
                .id(p.getId()).nom(p.getNom())
                .description(p.getDescription())
                .prix(p.getPrix()).stock(p.getStock())
                .categorie(p.getCategorie())
                .urlImage(p.getUrlImage())
                .disponible(p.isDisponible())
                .build();
    }

    private CommandeResponse toCommandeResponse(Commande c) {
        return CommandeResponse.builder()
                .id(c.getId())
                .montantTotal(c.getMontantTotal())
                .statut(c.getStatut())
                .adresseLivraison(c.getAdresseLivraison())
                .dateCommande(c.getDateCommande())
                .lignes(c.getLignes().stream().map(l ->
                        CommandeResponse.LigneResponse.builder()
                                .produitNom(l.getProduit().getNom())
                                .quantite(l.getQuantite())
                                .prixUnitaire(l.getPrixUnitaire())
                                .build()
                ).collect(Collectors.toList()))
                .build();
    }

    private TicketResponse toTicketResponse(Ticket t) {
        return TicketResponse.builder()
                .id(t.getId())
                .matchInfo(t.getMatch().getDateMatch() + " — " + t.getMatch().getLieu())
                .categorie(t.getCategorie())
                .prix(t.getPrix())
                .statut(t.getStatut())
                .codeTicket(t.getCodeTicket())
                .dateAchat(t.getDateAchat())
                .build();
    }
}
