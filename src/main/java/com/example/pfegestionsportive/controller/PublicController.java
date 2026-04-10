package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.ContactRequest;
import com.example.pfegestionsportive.dto.response.ClubResponse;
import com.example.pfegestionsportive.dto.response.MatchResponse;
import com.example.pfegestionsportive.model.entity.Message;
import com.example.pfegestionsportive.model.entity.User;
import com.example.pfegestionsportive.model.enums.Role;
import com.example.pfegestionsportive.repository.MessageRepository;
import com.example.pfegestionsportive.repository.UserRepository;
import com.example.pfegestionsportive.service.ClubService;
import com.example.pfegestionsportive.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final MatchService matchService;
    private final ClubService clubService;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    @GetMapping("/matches")
    public ResponseEntity<List<MatchResponse>> getAllMatches() {
        return ResponseEntity.ok(matchService.getAll());
    }

    @GetMapping("/clubs")
    public ResponseEntity<List<ClubResponse>> getAllClubs() {
        return ResponseEntity.ok(clubService.getAll());
    }

    @GetMapping("/clubs/{id}")
    public ResponseEntity<ClubResponse> getClubById(@PathVariable String id) {
        return ResponseEntity.ok(clubService.getById(id));
    }

    // ✅ POST /api/public/contact — sans authentification
    @PostMapping("/contact")
    public ResponseEntity<String> contact(@RequestBody @Valid ContactRequest req) {

        // Destinataire = SUPER_ADMIN
        User superAdmin = userRepository.findFirstByRole(Role.SUPER_ADMIN)
                .orElse(null);

        if (superAdmin == null) {
            return ResponseEntity.ok("Message reçu. Nous vous contacterons bientôt.");
        }

        // Contenu complet avec infos du visiteur
        String contenu = String.format(
                "📬 Message de contact public\n\n" +
                        " Nom     : %s\n" +
                        "✉ Email   : %s\n" +
                        " Tél     : %s\n\n" +
                        " Sujet   : %s\n\n" +
                        "%s",
                req.getNom(),
                req.getEmail(),
                req.getTelephone() != null ? req.getTelephone() : "—",
                req.getSujet(),
                req.getMessage()
        );

        // Chercher si l'email correspond à un user existant
        User sender = userRepository.findByEmail(req.getEmail())
                .orElse(superAdmin); // si pas trouvé → sender = superAdmin (placeholder)

        Message message = Message.builder()
                .sender(sender)
                .receiver(superAdmin)
                .sujet("[Contact] " + req.getNom() + " — " + req.getSujet())
                .contenu(contenu)
                .build();

        messageRepository.save(message);

        return ResponseEntity.ok("Message envoyé avec succès.");
    }
}