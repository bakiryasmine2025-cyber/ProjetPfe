package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.ChangeAccountStatusRequest;
import com.example.pfegestionsportive.dto.request.RegisterRequest;
import com.example.pfegestionsportive.dto.request.SendMessageRequest;
import com.example.pfegestionsportive.dto.request.UpdateProfileRequest;
import com.example.pfegestionsportive.dto.response.AuditLogResponse;
import com.example.pfegestionsportive.dto.response.MessageResponse;
import com.example.pfegestionsportive.dto.response.UserResponse;
import com.example.pfegestionsportive.model.entity.Message;
import com.example.pfegestionsportive.model.entity.User;
import com.example.pfegestionsportive.model.enums.AccountStatus;
import com.example.pfegestionsportive.model.enums.Role;
import com.example.pfegestionsportive.repository.MessageRepository;
import com.example.pfegestionsportive.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final MessageRepository messageRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    // ═══════════════════════════════════════════════
    // PENDING — par rôle
    // ═══════════════════════════════════════════════

    public List<UserResponse> getPendingAccounts() {
        return userRepository.findByStatutAndRole(
                        AccountStatus.PENDING_APPROVAL, Role.FEDERATION_ADMIN).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getPendingClubAdmins() {
        return userRepository.findByStatutAndRole(
                        AccountStatus.PENDING_APPROVAL, Role.CLUB_ADMIN).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ═══════════════════════════════════════════════
    // APPROUVER
    // ═══════════════════════════════════════════════

    @Transactional
    public UserResponse approuverCompte(String userId, String approverEmail) {
        User approver = userRepository.findByEmail(approverEmail)
                .orElseThrow(() -> new RuntimeException("Approbateur introuvable"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (user.getStatut() != AccountStatus.PENDING_APPROVAL)
            throw new RuntimeException("Ce compte n'est pas en attente d'approbation.");

        if (approver.getRole() == Role.SUPER_ADMIN && user.getRole() != Role.FEDERATION_ADMIN)
            throw new AccessDeniedException("Le Super Admin approuve uniquement les comptes Fédération.");

        if (approver.getRole() == Role.FEDERATION_ADMIN && user.getRole() != Role.CLUB_ADMIN)
            throw new AccessDeniedException("La Fédération approuve uniquement les comptes Club Admin.");

        user.setStatut(AccountStatus.ACTIVE);
        userRepository.save(user);

        emailService.sendAccountApprovedEmail(user.getEmail(), user.getNom(), user.getRole().name());
        return toResponse(user);
    }

    @Transactional
    public UserResponse rejeterCompte(String userId, String approverEmail, String motif) {
        User approver = userRepository.findByEmail(approverEmail)
                .orElseThrow(() -> new RuntimeException("Approbateur introuvable"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (approver.getRole() == Role.SUPER_ADMIN && user.getRole() != Role.FEDERATION_ADMIN)
            throw new AccessDeniedException("Le Super Admin rejette uniquement les comptes Fédération.");

        if (approver.getRole() == Role.FEDERATION_ADMIN && user.getRole() != Role.CLUB_ADMIN)
            throw new AccessDeniedException("La Fédération rejette uniquement les comptes Club Admin.");

        user.setStatut(AccountStatus.REJECTED);
        userRepository.save(user);

        emailService.sendAccountRejectedEmail(user.getEmail(), user.getNom(), motif);
        return toResponse(user);
    }

    // ═══════════════════════════════════════════════
    // SUPER ADMIN — gestion comptes
    // ═══════════════════════════════════════════════

    @Transactional
    public UserResponse changeAccountStatus(String userId, ChangeAccountStatusRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        user.setStatut(req.getStatut());
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse changeRole(String userId, Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        user.setRole(role);
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void resetPassword(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        String tempPassword = UUID.randomUUID().toString().substring(0, 8);
        user.setMotDePasseHash(passwordEncoder.encode(tempPassword));
        userRepository.save(user);
        emailService.sendTempPassword(user.getEmail(), user.getNom(), tempPassword);
    }

    @Transactional
    public UserResponse createUser(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email déjà utilisé");
        User user = User.builder()
                .nom(req.getNom())
                .email(req.getEmail())
                .motDePasseHash(passwordEncoder.encode(req.getPassword()))
                .telephone(req.getTelephone())
                .role(req.getRole())
                .statut(AccountStatus.ACTIVE)
                .build();
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(String id) {
        if (!userRepository.existsById(id))
            throw new RuntimeException("Utilisateur introuvable");
        userRepository.deleteById(id);
    }

    // ═══════════════════════════════════════════════
    // LECTURE
    // ═══════════════════════════════════════════════

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(String id) {
        return userRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    public UserResponse getMyProfile(String email) {
        return userRepository.findByEmail(email)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    @Transactional
    public UserResponse updateMyProfile(String email, UpdateProfileRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (req.getNom() != null) user.setNom(req.getNom());
        if (req.getTelephone() != null) user.setTelephone(req.getTelephone());
        return toResponse(userRepository.save(user));
    }

    // ═══════════════════════════════════════════════
    // MESSAGES
    // ═══════════════════════════════════════════════

    public List<MessageResponse> getMyMessages(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        return messageRepository.findByReceiverOrderByDateEnvoiDesc(user).stream()
                .map(this::toMessageResponse)
                .collect(Collectors.toList());
    }

    public void markAsRead(String messageId) {
        Message msg = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message introuvable"));
        msg.setLu(true);
        messageRepository.save(msg);
    }

    public Long countUnread(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        return messageRepository.countByReceiverAndLuFalse(user);
    }

    // Envoyer un message à un utilisateur spécifique (par ID)
    public MessageResponse sendMessage(String senderEmail, SendMessageRequest req) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Expéditeur non trouvé"));

        // Vérifier que receiverId n'est pas null
        if (req.getReceiverId() == null || req.getReceiverId().trim().isEmpty()) {
            throw new RuntimeException("L'ID du destinataire est requis");
        }

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

    // Envoyer un message à la Fédération (premier admin trouvé)
    public MessageResponse sendMessageToFederation(String senderEmail, SendMessageRequest req) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Expéditeur non trouvé"));

        User federationReceiver = userRepository.findFirstByRole(Role.FEDERATION_ADMIN)
                .orElseThrow(() -> new RuntimeException("Aucun administrateur de la fédération trouvé"));

        Message msg = Message.builder()
                .sender(sender)
                .receiver(federationReceiver)
                .sujet(req.getSujet())
                .contenu(req.getContenu())
                .build();

        return toMessageResponse(messageRepository.save(msg));
    }

    // Envoyer un message à tous les utilisateurs d'un rôle spécifique
    @Transactional
    public List<MessageResponse> sendMessageToRole(String senderEmail, Role targetRole, SendMessageRequest req) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Expéditeur non trouvé"));

        if (sender.getRole() != Role.SUPER_ADMIN) {
            throw new AccessDeniedException("Seul le Super Admin peut envoyer des messages à un rôle entier");
        }

        List<User> receivers = userRepository.findByStatutAndRole(AccountStatus.ACTIVE, targetRole);

        if (receivers.isEmpty()) {
            throw new RuntimeException("Aucun utilisateur actif trouvé avec le rôle: " + targetRole);
        }

        List<Message> messages = receivers.stream()
                .map(receiver -> Message.builder()
                        .sender(sender)
                        .receiver(receiver)
                        .sujet(req.getSujet())
                        .contenu(req.getContenu())
                        .build())
                .collect(Collectors.toList());

        List<Message> savedMessages = messageRepository.saveAll(messages);

        return savedMessages.stream()
                .map(this::toMessageResponse)
                .collect(Collectors.toList());
    }

    // Envoyer un message à tous les utilisateurs
    @Transactional
    public List<MessageResponse> sendMessageToAllUsers(String senderEmail, SendMessageRequest req) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Expéditeur non trouvé"));

        if (sender.getRole() != Role.SUPER_ADMIN) {
            throw new AccessDeniedException("Seul le Super Admin peut envoyer des messages à tous les utilisateurs");
        }

        List<User> receivers = userRepository.findByStatut(AccountStatus.ACTIVE).stream()
                .filter(user -> !user.getId().equals(sender.getId()))
                .collect(Collectors.toList());

        if (receivers.isEmpty()) {
            throw new RuntimeException("Aucun utilisateur actif trouvé");
        }

        List<Message> messages = receivers.stream()
                .map(receiver -> Message.builder()
                        .sender(sender)
                        .receiver(receiver)
                        .sujet(req.getSujet())
                        .contenu(req.getContenu())
                        .build())
                .collect(Collectors.toList());

        List<Message> savedMessages = messageRepository.saveAll(messages);

        return savedMessages.stream()
                .map(this::toMessageResponse)
                .collect(Collectors.toList());
    }

    public List<AuditLogResponse> getAuditLogs(String entite, String userId) {
        return List.of();
    }

    // ═══════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════

    private UserResponse toResponse(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .nom(u.getNom())
                .email(u.getEmail())
                .role(u.getRole() != null ? u.getRole().name() : null)
                .statut(u.getStatut() != null ? u.getStatut().name() : null)
                .telephone(u.getTelephone())
                .derniereConnexion(u.getDerniereConnexion())
                .dateCreation(u.getDateCreation())
                .build();
    }

    private MessageResponse toMessageResponse(Message m) {
        return MessageResponse.builder()
                .id(m.getId())
                .sujet(m.getSujet())
                .contenu(m.getContenu())
                .senderNom(m.getSender() != null ? m.getSender().getNom() : "Système")
                .lu(m.isLu())
                .dateEnvoi(m.getDateEnvoi())
                .build();
    }
}