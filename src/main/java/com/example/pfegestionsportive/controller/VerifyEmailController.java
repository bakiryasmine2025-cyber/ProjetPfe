package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.VerifyEmailRequest;
import com.example.pfegestionsportive.dto.response.ApiResponse;
import com.example.pfegestionsportive.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class VerifyEmailController {

    private final EmailService emailService;

    // ✅ Vérifier email avec code
    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(
            @Valid @RequestBody VerifyEmailRequest request) {
        emailService.verifierEmail(request.getEmail(), request.getCode());
        return ResponseEntity.ok(
                ApiResponse.success("Email vérifié avec succès", null)
        );
    }

    // ✅ Renvoyer le code de vérification
    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<Void>> resendVerification(
            @RequestParam String email) {
        emailService.renvoyerCodeVerification(email);
        return ResponseEntity.ok(
                ApiResponse.success("Code renvoyé sur votre email", null)
        );
    }
}