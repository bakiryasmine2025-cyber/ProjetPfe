package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.*;
import com.example.pfegestionsportive.dto.response.*;
import com.example.pfegestionsportive.model.enums.Role;
import com.example.pfegestionsportive.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ═══════════════════════════════════════════════
    // PROFIL — tout utilisateur connecté
    // ═══════════════════════════════════════════════

    @GetMapping("/users/profile")
    public ResponseEntity<UserResponse> getMyProfile(Authentication auth) {
        return ResponseEntity.ok(userService.getMyProfile(auth.getName()));
    }

    @PutMapping("/users/profile")
    public ResponseEntity<UserResponse> updateMyProfile(
            Authentication auth,
            @RequestBody @Valid UpdateProfileRequest req) {
        return ResponseEntity.ok(userService.updateMyProfile(auth.getName(), req));
    }

    // ═══════════════════════════════════════════════
    // MESSAGES
    // ═══════════════════════════════════════════════

    @GetMapping("/users/messages")
    public ResponseEntity<List<MessageResponse>> getMyMessages(Authentication auth) {
        return ResponseEntity.ok(userService.getMyMessages(auth.getName()));
    }

    @PutMapping("/users/messages/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String id) {
        userService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users/messages/unread-count")
    public ResponseEntity<Long> countUnread(Authentication auth) {
        return ResponseEntity.ok(userService.countUnread(auth.getName()));
    }

    // ═══════════════════════════════════════════════
    // SUPER ADMIN — gestion comptes
    // ═══════════════════════════════════════════════

    @GetMapping("/superadmin/users")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/superadmin/users/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping("/superadmin/users")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserResponse> createUser(@RequestBody @Valid RegisterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(req));
    }

    @DeleteMapping("/superadmin/users/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/superadmin/users/{id}/status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserResponse> changeStatus(
            @PathVariable String id,
            @RequestBody @Valid ChangeAccountStatusRequest req) {
        return ResponseEntity.ok(userService.changeAccountStatus(id, req));
    }

    @PutMapping("/superadmin/users/{id}/role")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserResponse> changeRole(
            @PathVariable String id,
            @RequestParam Role role) {
        return ResponseEntity.ok(userService.changeRole(id, role));
    }

    @PutMapping("/superadmin/users/{id}/reset-password")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> resetPassword(@PathVariable String id) {
        userService.resetPassword(id);
        return ResponseEntity.noContent().build();
    }

    // ═══════════════════════════════════════════════
    // SUPER ADMIN — approval FEDERATION_ADMIN
    // ═══════════════════════════════════════════════

    @GetMapping("/superadmin/users/pending")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<UserResponse>> getPendingFederationAdmins() {
        return ResponseEntity.ok(userService.getPendingAccounts());
    }

    @PutMapping("/superadmin/users/{id}/approuver")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserResponse> approuverFederationAdmin(
            @PathVariable String id,
            Authentication auth) {
        return ResponseEntity.ok(userService.approuverCompte(id, auth.getName()));
    }

    @PutMapping("/superadmin/users/{id}/rejeter")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserResponse> rejeterFederationAdmin(
            @PathVariable String id,
            Authentication auth,
            @RequestParam(required = false) String motif) {
        return ResponseEntity.ok(userService.rejeterCompte(id, auth.getName(), motif));
    }

    // ═══════════════════════════════════════════════
    // FEDERATION ADMIN — approval CLUB_ADMIN
    // ═══════════════════════════════════════════════

    @GetMapping("/federation/users/pending")
    @PreAuthorize("hasAnyRole('FEDERATION_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<UserResponse>> getPendingClubAdmins() {
        return ResponseEntity.ok(userService.getPendingClubAdmins());
    }

    @PutMapping("/federation/users/{id}/approuver")
    @PreAuthorize("hasRole('FEDERATION_ADMIN')")
    public ResponseEntity<UserResponse> approuverClubAdmin(
            @PathVariable String id,
            Authentication auth) {
        return ResponseEntity.ok(userService.approuverCompte(id, auth.getName()));
    }

    @PutMapping("/federation/users/{id}/rejeter")
    @PreAuthorize("hasRole('FEDERATION_ADMIN')")
    public ResponseEntity<UserResponse> rejeterClubAdmin(
            @PathVariable String id,
            Authentication auth,
            @RequestParam(required = false) String motif) {
        return ResponseEntity.ok(userService.rejeterCompte(id, auth.getName(), motif));
    }

    // ═══════════════════════════════════════════════
    // SUPER ADMIN — messages
    // ═══════════════════════════════════════════════

    // Envoyer un message à un utilisateur spécifique (par son ID)
    @PostMapping("/superadmin/messages")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<MessageResponse> sendMessage(
            Authentication auth,
            @RequestBody @Valid SendMessageRequest req) {
        return ResponseEntity.ok(userService.sendMessage(auth.getName(), req));
    }

    // Envoyer un message à la Fédération (premier admin trouvé)
    @PostMapping("/superadmin/messages/to-federation")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<MessageResponse> sendMessageToFederation(
            Authentication auth,
            @RequestBody @Valid SendMessageRequest req) {
        return ResponseEntity.ok(userService.sendMessageToFederation(auth.getName(), req));
    }

    // Envoyer un message à tous les utilisateurs d'un rôle spécifique
    @PostMapping("/superadmin/messages/to-role/{role}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<MessageResponse>> sendMessageToRole(
            Authentication auth,
            @PathVariable Role role,
            @RequestBody @Valid SendMessageRequest req) {
        return ResponseEntity.ok(userService.sendMessageToRole(auth.getName(), role, req));
    }

    // Envoyer un message à tous les utilisateurs
    @PostMapping("/superadmin/messages/to-all")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<MessageResponse>> sendMessageToAllUsers(
            Authentication auth,
            @RequestBody @Valid SendMessageRequest req) {
        return ResponseEntity.ok(userService.sendMessageToAllUsers(auth.getName(), req));
    }

    @GetMapping("/superadmin/logs")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogs(
            @RequestParam(required = false) String entite,
            @RequestParam(required = false) String userId) {
        return ResponseEntity.ok(userService.getAuditLogs(entite, userId));
    }
}