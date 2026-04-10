package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.*;
import com.example.pfegestionsportive.dto.response.AuthResponse;
import com.example.pfegestionsportive.model.enums.Role;
import com.example.pfegestionsportive.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ✅ POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody @Valid LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    // ✅ POST /api/auth/register (generic)
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody @Valid RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    // ✅ POST /api/auth/register/federation-admin
    @PostMapping("/register/federation-admin")
    public ResponseEntity<String> registerFederationAdmin(
            @RequestBody @Valid RegisterRequest req) {
        return ResponseEntity.ok(authService.registerFederationAdmin(req));
    }

    // ✅ POST /api/auth/register/club-admin
    // ⚠️ Pas de @Valid ici — on set le role manuellement pour éviter l'erreur @NotNull
    @PostMapping("/register/club-admin")
    public ResponseEntity<?> registerClubAdmin(@RequestBody RegisterRequest req) {
        try {
            // ✅ Fix: forcer le role côté backend — pas besoin de l'envoyer depuis le frontend
            req.setRole(Role.CLUB_ADMIN);
            String message = authService.registerClubAdmin(req);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ✅ POST /api/auth/verify-email
    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(
            @RequestBody @Valid VerifyEmailRequest req) {
        return ResponseEntity.ok(authService.verifyEmail(req));
    }

    // ✅ POST /api/auth/resend-code
    @PostMapping("/resend-code")
    public ResponseEntity<String> resendCode(
            @RequestParam String email) {
        return ResponseEntity.ok(authService.resendCode(email));
    }

    // ✅ POST /api/auth/forgot-password
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody @Valid ForgotPasswordRequest req) {
        return ResponseEntity.ok(authService.forgotPassword(req));
    }

    // ✅ POST /api/auth/reset-password
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody @Valid ResetPasswordRequest req) {
        return ResponseEntity.ok(authService.resetPassword(req));
    }

    // ✅ POST /api/auth/approve/federation-admin/{userId} (SUPER_ADMIN only)
    @PostMapping("/approve/federation-admin/{userId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<String> approveFederationAdmin(
            @PathVariable String userId) {
        return ResponseEntity.ok(authService.approveFederationAdmin(userId));
    }

    // ✅ POST /api/auth/approve/club-admin/{userId} (FEDERATION_ADMIN only)
    @PostMapping("/approve/club-admin/{userId}")
    @PreAuthorize("hasRole('FEDERATION_ADMIN')")
    public ResponseEntity<String> approveClubAdmin(
            @PathVariable String userId) {
        return ResponseEntity.ok(authService.approveClubAdmin(userId));
    }

    // ✅ POST /api/auth/reject/{userId}
    @PostMapping("/reject/{userId}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('FEDERATION_ADMIN')")
    public ResponseEntity<String> rejectRegistration(
            @PathVariable String userId,
            @RequestParam String reason) {
        return ResponseEntity.ok(authService.rejectRegistration(userId, reason));
    }
}