package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.*;
import com.example.pfegestionsportive.dto.response.MessageResponse;
import com.example.pfegestionsportive.dto.response.UserResponse;
import com.example.pfegestionsportive.model.entity.Message;
import com.example.pfegestionsportive.model.entity.User;
import com.example.pfegestionsportive.model.enums.AccountStatus;
import com.example.pfegestionsportive.model.enums.Role;
import com.example.pfegestionsportive.repository.MessageRepository;
import com.example.pfegestionsportive.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final MessageRepository messageRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // ✅ 1.1 - Voir son profil
    public UserResponse getMyProfile(String email) {
        return toUserResponse(findByEmail(email));
    }

    // ✅ 1.1 - Modifier son profil
    public UserResponse updateMyProfile(String email, UpdateProfileRequest req) {
        User user = findByEmail(email);

        if (req.getNom() != null && !req.getNom().isBlank())
            user.setNom(req.getNom());
        if (req.getTelephone() != null && !req.getTelephone().isBlank())
            user.setTelephone(req.getTelephone());
        if (req.getNewPassword() != null && !req.getNewPassword().isBlank())
            user.setMotDePasseHash(passwordEncoder.encode(req.getNewPassword()));

        return toUserResponse(userRepository.save(user));
    }

    // ✅ 1.2 - Liste tous les utilisateurs
    public List<UserResponse> getAllUsers() {
        return userRepository.findAllByOrderByDateCreationDesc()
                .stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    // ✅ 1.2 - Changer statut + message automatique
    public UserResponse changeAccountStatus(String userId,
                                            ChangeAccountStatusRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        AccountStatus ancienStatut = user.getStatut();
        user.setStatut(req.getStatut());
        userRepository.save(user);

        User superAdmin = userRepository.findFirstByRole(Role.SUPER_ADMIN)
                .orElseThrow(() -> new RuntimeException("Super admin introuvable"));

        String sujet = buildSujet(req.getStatut());
        String contenu = buildContenu(user.getNom(), ancienStatut,
                req.getStatut(), req.getMessage());

        Message msg = Message.builder()
                .sender(superAdmin)
                .receiver(user)
                .sujet(sujet)
                .contenu(contenu)
                .build();
        messageRepository.save(msg);

        emailService.sendStatusChangeEmail(user.getEmail(), user.getNom(),
                sujet, contenu);

        return toUserResponse(user);
    }

    // ✅ Envoyer message manuel
    public MessageResponse sendMessage(String senderEmail,
                                       SendMessageRequest req) {
        User sender = findByEmail(senderEmail);
        User receiver = userRepository.findById(req.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Destinataire introuvable"));

        Message msg = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .sujet(req.getSujet())
                .contenu(req.getContenu())
                .build();

        return toMessageResponse(messageRepository.save(msg));
    }

    // ✅ Voir mes messages
    public List<MessageResponse> getMyMessages(String email) {
        User user = findByEmail(email);
        return messageRepository
                .findByReceiverIdOrderByDateEnvoiDesc(user.getId())
                .stream()
                .map(this::toMessageResponse)
                .collect(Collectors.toList());
    }

    // ✅ Marquer comme lu
    public void markAsRead(String messageId) {
        Message msg = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message introuvable"));
        msg.setLu(true);
        messageRepository.save(msg);
    }

    // ✅ Nb messages non lus
    public long countUnread(String email) {
        return messageRepository
                .countByReceiverIdAndLuFalse(findByEmail(email).getId());
    }

    // ─── Helpers ───
    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    private String buildSujet(AccountStatus statut) {
        return switch (statut) {
            case ACTIVE    -> "✅ Votre compte a été activé";
            case INACTIVE  -> "⚠️ Votre compte a été désactivé";
            case SUSPENDED -> "🚫 Votre compte a été suspendu";
        };
    }

    private String buildContenu(String nom, AccountStatus ancien,
                                AccountStatus nouveau, String raison) {
        StringBuilder sb = new StringBuilder();
        sb.append("Bonjour ").append(nom).append(",\n\n");
        switch (nouveau) {
            case ACTIVE ->
                    sb.append("Votre compte est maintenant actif.")
                            .append(" Vous pouvez vous connecter normalement.");
            case INACTIVE ->
                    sb.append("Votre compte a été désactivé.")
                            .append(" Contactez l'administration pour plus d'informations.");
            case SUSPENDED -> {
                sb.append("Votre compte a été suspendu.");
                if (raison != null && !raison.isBlank())
                    sb.append("\n\nRaison : ").append(raison);
            }
        }
        sb.append("\n\nL'équipe Rugby Tunisie 🏉");
        return sb.toString();
    }

    private UserResponse toUserResponse(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .nom(u.getNom())
                .email(u.getEmail())
                .telephone(u.getTelephone())
                .role(u.getRole().name())
                .statut(u.getStatut().name())
                .derniereConnexion(u.getDerniereConnexion())
                .dateCreation(u.getDateCreation())
                .build();
    }

    private MessageResponse toMessageResponse(Message m) {
        return MessageResponse.builder()
                .id(m.getId())
                .senderNom(m.getSender().getNom())
                .receiverNom(m.getReceiver().getNom())
                .receiverEmail(m.getReceiver().getEmail())
                .sujet(m.getSujet())
                .contenu(m.getContenu())
                .lu(m.isLu())
                .dateEnvoi(m.getDateEnvoi())
                .build();
    }
}
