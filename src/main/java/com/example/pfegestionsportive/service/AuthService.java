package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.Security.UserDetailsServiceImpl;
import com.example.pfegestionsportive.dto.request.*;
import com.example.pfegestionsportive.dto.response.AuthResponse;
import com.example.pfegestionsportive.model.entity.Club;
import com.example.pfegestionsportive.model.entity.User;
import com.example.pfegestionsportive.model.entity.VerificationCode;
import com.example.pfegestionsportive.model.enums.*;
import com.example.pfegestionsportive.repository.*;
import com.example.pfegestionsportive.Security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
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
    private final ClubRepository clubRepository;
    private final JoueurRepository joueurRepository;

    // ================= REGISTER =================

    public String register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email déjà utilisé");

        User user = User.builder()
                .nom(req.getNom())
                .email(req.getEmail())
                .motDePasseHash(passwordEncoder.encode(req.getPassword()))
                .telephone(req.getTelephone())
                .role(req.getRole())
                .statut(getDefaultStatus(req.getRole()))
                .build();

        userRepository.save(user);
        sendVerification(req.getEmail(), req.getNom());
        return "Compte créé. Vérifiez votre email.";
    }

    public String registerFederationAdmin(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email déjà utilisé");

        User user = User.builder()
                .nom(req.getNom())
                .email(req.getEmail())
                .motDePasseHash(passwordEncoder.encode(req.getPassword()))
                .telephone(req.getTelephone())
                .role(Role.FEDERATION_ADMIN)
                .statut(AccountStatus.PENDING_APPROVAL)
                .build();

        userRepository.save(user);
        sendVerification(req.getEmail(), req.getNom());
        notifySuperAdmin(user);
        return "En attente d'approbation SUPER_ADMIN.";
    }

    public String registerClubAdmin(RegisterRequest req) {
        // 1. Vérifier si email déjà utilisé
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email déjà utilisé");

        // 2. Vérifier si un club avec ce nom existe déjà
        if (clubRepository.existsByNom(req.getNomClub()))
            throw new RuntimeException("Un compte existe déjà pour ce club. Contactez l'administrateur de la fédération.");

        // 3. Créer le club avec statut INACTIF
        Club club = Club.builder()
                .nom(req.getNomClub())
                .statut(ClubStatus.INACTIF)
                .dateCreation(LocalDateTime.now())
                .build();
        clubRepository.save(club);

        // 4. Créer le User
        User user = User.builder()
                .nom(req.getNom())
                .email(req.getEmail())
                .motDePasseHash(passwordEncoder.encode(req.getPassword()))
                .telephone(req.getTelephone())
                .role(Role.CLUB_ADMIN)
                .club(club)
                .statut(AccountStatus.PENDING_APPROVAL)
                .build();
        userRepository.save(user);

        // 5. Notifier la fédération
        notifyFederationAdmin(user);

        return "En attente d'approbation FEDERATION_ADMIN.";
    }

    // ================= VERIFY =================

    public String verifyEmail(VerifyEmailRequest req) {
        VerificationCode verif = verificationCodeRepository
                .findByEmailAndCodeAndStatut(
                        req.getEmail(), req.getCode(), VerificationStatus.PENDING)
                .orElseThrow(() -> new RuntimeException("Code invalide"));

        if (verif.getDateExpiration().isBefore(LocalDateTime.now())) {
            verif.setStatut(VerificationStatus.EXPIRED);
            verificationCodeRepository.save(verif);
            throw new RuntimeException("Code expiré");
        }

        User user = userRepository.findByEmail(req.getEmail()).orElseThrow();

        if (user.getStatut() != AccountStatus.PENDING_APPROVAL) {
            user.setStatut(AccountStatus.ACTIVE);
        }

        userRepository.save(user);

        verif.setStatut(VerificationStatus.VERIFIED);
        verificationCodeRepository.save(verif);

        emailService.sendWelcomeEmail(user.getEmail(), user.getNom());

        return "Email vérifié";
    }

    public String resendCode(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email introuvable"));
        sendVerification(email, user.getNom());
        return "Code renvoyé";
    }

    // ================= APPROVAL =================

    public String approveFederationAdmin(String userId) {
        User user = getUser(userId);
        user.setStatut(AccountStatus.ACTIVE);
        userRepository.save(user);
        emailService.sendAccountApprovedEmail(user.getEmail(), user.getNom(), user.getRole().name());
        return "FEDERATION_ADMIN approuvé";
    }

    public String approveClubAdmin(String userId) {
        User user = getUser(userId);
        user.setStatut(AccountStatus.ACTIVE);

        if (user.getClub() != null) {
            user.getClub().setStatut(ClubStatus.ACTIF);
            clubRepository.save(user.getClub());
        }

        userRepository.save(user);
        emailService.sendAccountApprovedEmail(user.getEmail(), user.getNom(), user.getRole().name());
        return "CLUB_ADMIN approuvé";
    }

    public String rejectRegistration(String userId, String reason) {
        User user = getUser(userId);
        user.setStatut(AccountStatus.REJECTED);
        userRepository.save(user);
        emailService.sendAccountRejectedEmail(user.getEmail(), user.getNom(), reason);
        return "Inscription rejetée";
    }

    // ================= LOGIN =================

    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        User user = userRepository.findByEmail(req.getEmail()).orElseThrow();
        UserDetails userDetails = userDetailsService.loadUserByUsername(req.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .nom(user.getNom())
                .email(user.getEmail())
                .role(user.getRole().name())
                .statut(user.getStatut().name())
                .build();
    }

    // ================= PASSWORD =================

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
        return "Code envoyé";
    }

    public String resetPassword(ResetPasswordRequest req) {
        VerificationCode verif = verificationCodeRepository
                .findByEmailAndCodeAndStatut(
                        req.getEmail(), req.getCode(), VerificationStatus.PENDING)
                .orElseThrow(() -> new RuntimeException("Code invalide"));

        if (verif.getDateExpiration().isBefore(LocalDateTime.now()))
            throw new RuntimeException("Code expiré");

        User user = userRepository.findByEmail(req.getEmail()).orElseThrow();
        user.setMotDePasseHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        return "Mot de passe changé";
    }

    // ================= HELPERS =================

    private void sendVerification(String email, String nom) {
        String code = generateCode();
        verificationCodeRepository.deleteByEmail(email);
        verificationCodeRepository.save(VerificationCode.builder()
                .email(email)
                .code(code)
                .build());
        emailService.sendVerificationCode(email, nom, code);
    }

    private void notifySuperAdmin(User user) {
        userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.SUPER_ADMIN)
                .forEach(admin -> emailService.sendApprovalRequestNotification(
                        admin.getEmail(), admin.getNom(),
                        user.getNom(), user.getEmail(), user.getRole().name()));
    }

    private void notifyFederationAdmin(User user) {
        userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.FEDERATION_ADMIN
                        && u.getStatut() == AccountStatus.ACTIVE)
                .forEach(admin -> emailService.sendApprovalRequestNotification(
                        admin.getEmail(), admin.getNom(),
                        user.getNom(), user.getEmail(), user.getRole().name()));
    }

    private AccountStatus getDefaultStatus(Role role) {
        return switch (role) {
            case FEDERATION_ADMIN, CLUB_ADMIN -> AccountStatus.PENDING_APPROVAL;
            default -> AccountStatus.INACTIVE;
        };
    }

    private User getUser(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User introuvable"));
    }

    private String generateCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }
}