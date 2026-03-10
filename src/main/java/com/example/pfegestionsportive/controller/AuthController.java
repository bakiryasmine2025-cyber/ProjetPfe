
package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.LoginRequest;
import com.example.pfegestionsportive.dto.request.RegisterRequest;
import com.example.pfegestionsportive.dto.request.ResetPasswordRequest;
import com.example.pfegestionsportive.dto.response.ApiResponse;
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

    // ✅ Register
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(
            @Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Compte créé, vérifiez votre email", null
                )
        );
    }

    // ✅ Login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(
                ApiResponse.success("Connexion réussie", response)
        );
    }

    // ✅ Forgot Password
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @RequestParam String email) {
        authService.demanderResetPassword(email);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Code de réinitialisation envoyé sur votre email", null
                )
        );
    }

    // ✅ Reset Password
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(
                ApiResponse.success("Mot de passe réinitialisé avec succès", null)
        );
    }
}