package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.*;
import com.example.pfegestionsportive.dto.response.MessageResponse;
import com.example.pfegestionsportive.dto.response.UserResponse;
import com.example.pfegestionsportive.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    // ─── 1.1 Mon Profil ───

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

    // ─── Messages ───

    @GetMapping("/users/messages")
    public ResponseEntity<List<MessageResponse>> getMyMessages(
            Authentication auth) {
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

    // ─── 1.2 Super Admin ───

    @GetMapping("/superadmin/users")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/superadmin/users/{id}/status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserResponse> changeStatus(
            @PathVariable String id,
            @RequestBody @Valid ChangeAccountStatusRequest req) {
        return ResponseEntity.ok(userService.changeAccountStatus(id, req));
    }

    @PostMapping("/superadmin/messages")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<MessageResponse> sendMessage(
            Authentication auth,
            @RequestBody @Valid SendMessageRequest req) {
        return ResponseEntity.ok(userService.sendMessage(auth.getName(), req));
    }
}