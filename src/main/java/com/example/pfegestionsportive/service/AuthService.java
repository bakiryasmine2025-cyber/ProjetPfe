package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.Security.UserDetailsServiceImpl;
import com.example.pfegestionsportive.dto.request.*;
import com.example.pfegestionsportive.dto.response.AuthResponse;
import com.example.pfegestionsportive.model.entity.User;
import com.example.pfegestionsportive.model.entity.VerificationCode;
import com.example.pfegestionsportive.model.enums.AccountStatus;
import com.example.pfegestionsportive.model.enums.VerificationStatus;
import com.example.pfegestionsportive.repository.UserRepository;
import com.example.pfegestionsportive.repository.VerificationCodeRepository;
import com.example.pfegestionsportive.Security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final VerificationCodeRepository verificationCodeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final EmailService emailService;

    // ✅ 2.2 - Créer compte
    public String register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email déjà utilisé");

        User user = User.builder()
                .nom(req.getNom())
                .email(req.getEmail())
                .motDePasseHash(passwordEncoder.encode(req.getPassword()))
                .telephone(req.getTelephone())
                .role(req.getRole())
                .statut(AccountStatus.INACTIVE)
                .build();
        userRepository.save(user);

        String code = generateCode();
        verificationCodeRepository.deleteByEmail(req.getEmail());
        verificationCodeRepository.save(VerificationCode.builder()
                .email(req.getEmail())
                .code(code)
                .build());

        emailService.sendVerificationCode(req.getEmail(), req.getNom(), code);
        return "Compte créé. Vérifiez votre email.";
    }

    // ✅ 2.2 - Vérifier email
    public String verifyEmail(VerifyEmailRequest req) {
        VerificationCode verif = verificationCodeRepository
                .findByEmailAndCodeAndStatut(
                        req.getEmail(), req.getCode(), VerificationStatus.PENDING)
                .orElseThrow(() -> new RuntimeException("Code invalide"));

        if (verif.getDateExpiration().isBefore(LocalDateTime.now())) {
            verif.setStatut(VerificationStatus.EXPIRED);
            verificationCodeRepository.save(verif);
            throw new RuntimeException("Code expiré. Demandez un nouveau code.");
        }

        User user = userRepository.findByEmail(req.getEmail()).orElseThrow();
        user.setStatut(AccountStatus.ACTIVE);
        userRepository.save(user);

        verif.setStatut(VerificationStatus.VERIFIED);
        verificationCodeRepository.save(verif);

        emailService.sendWelcomeEmail(user.getEmail(), user.getNom());
        return "Email vérifié. Vous pouvez vous connecter.";
    }

    // ✅ 2.2 - Renvoyer code
    public String resendCode(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email introuvable"));

        if (user.getStatut() == AccountStatus.ACTIVE)
            throw new RuntimeException("Compte déjà vérifié");

        String code = generateCode();
        verificationCodeRepository.deleteByEmail(email);
        verificationCodeRepository.save(VerificationCode.builder()
                .email(email)
                .code(code)
                .build());

        emailService.sendVerificationCode(email, user.getNom(), code);
        return "Nouveau code envoyé sur " + email;
    }

    // ✅ 2.1 - Login
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Email ou mot de passe incorrect"));

        if (user.getStatut() == AccountStatus.INACTIVE)
            throw new RuntimeException("Compte non vérifié. Vérifiez votre email.");

        if (user.getStatut() == AccountStatus.SUSPENDED)
            throw new RuntimeException("Compte suspendu. Contactez l'administration.");

        authManager.authenticate(new UsernamePasswordAuthenticationToken(
                req.getEmail(), req.getPassword()));

        user.setDerniereConnexion(LocalDateTime.now());
        userRepository.save(user);

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(req.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .nom(user.getNom())
                .email(user.getEmail())
                .role(user.getRole().name())
                .statut(user.getStatut().name())
                .build();
    }

    // ✅ 2.3 - Forgot password
    public String forgotPassword(ForgotPasswordRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Email introuvable"));

        String code = generateCode();
        verificationCodeRepository.deleteByEmail(req.getEmail());
        verificationCodeRepository.save(VerificationCode.builder()
                .email(req.getEmail())
                .code(code)
                .build());

        emailService.sendResetCode(req.getEmail(), user.getNom(), code);
        return "Code envoyé sur " + req.getEmail();
    }

    // ✅ 2.3 - Reset password
    public String resetPassword(ResetPasswordRequest req) {
        VerificationCode verif = verificationCodeRepository
                .findByEmailAndCodeAndStatut(
                        req.getEmail(), req.getCode(), VerificationStatus.PENDING)
                .orElseThrow(() -> new RuntimeException("Code invalide"));

        if (verif.getDateExpiration().isBefore(LocalDateTime.now())) {
            verif.setStatut(VerificationStatus.EXPIRED);
            verificationCodeRepository.save(verif);
            throw new RuntimeException("Code expiré. Demandez un nouveau code.");
        }

        User user = userRepository.findByEmail(req.getEmail()).orElseThrow();
        user.setMotDePasseHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        verif.setStatut(VerificationStatus.VERIFIED);
        verificationCodeRepository.save(verif);
        return "Mot de passe réinitialisé avec succès.";
    }

    private String generateCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }
}
