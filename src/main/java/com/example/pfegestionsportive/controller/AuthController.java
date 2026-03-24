package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.*;
import com.example.pfegestionsportive.dto.response.AuthResponse;
import com.example.pfegestionsportive.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody @Valid LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody @Valid RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    // POST /api/auth/verify-email
    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(
            @RequestBody @Valid VerifyEmailRequest req) {
        return ResponseEntity.ok(authService.verifyEmail(req));
    }

    // POST /api/auth/resend-code
    @PostMapping("/resend-code")
    public ResponseEntity<String> resendCode(
            @RequestParam String email) {
        return ResponseEntity.ok(authService.resendCode(email));
    }

    // POST /api/auth/forgot-password
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody @Valid ForgotPasswordRequest req) {
        return ResponseEntity.ok(authService.forgotPassword(req));
    }

    // POST /api/auth/reset-password
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody @Valid ResetPasswordRequest req) {
        return ResponseEntity.ok(authService.resetPassword(req));
    }
}