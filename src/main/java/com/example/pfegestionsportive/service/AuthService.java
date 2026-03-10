package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.LoginRequest;
import com.example.pfegestionsportive.dto.request.RegisterRequest;
import com.example.pfegestionsportive.dto.request.ResetPasswordRequest;
import com.example.pfegestionsportive.dto.response.AuthResponse;
import com.example.pfegestionsportive.exception.ResourceNotFoundException;
import com.example.pfegestionsportive.exception.UnauthorizedException;
import com.example.pfegestionsportive.model.entity.Utilisateur;
import com.example.pfegestionsportive.model.enums.Role;
import com.example.pfegestionsportive.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;

    // ✅ Register msalla7: ykhalli el user actif mel sfer
    public void register(RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new UnauthorizedException("Email déjà utilisé");
        }

        String code = genererCode();

        Utilisateur utilisateur = Utilisateur.builder()
                .email(request.getEmail())
                .motDePasseHash(passwordEncoder.encode(request.getMotDePasse()))
                .telephone(request.getTelephone())
                .role(Role.SUPER_ADMIN) // Baddeltou SUPER_ADMIN bech tnajem todkhel lel dashboard
                .actif(true) // 👈 Rje3 true bech ma t'activihch mel base
                .codeVerification(code)
                .codeVerificationExpiration(LocalDateTime.now().plusMinutes(10))
                .build();

        utilisateurRepository.save(utilisateur);

        // emailService.sendVerificationEmail(request.getEmail(), code); // Khalliha commentée tawa bech ma t'atalkech
    }

    // ✅ Login msalla7: na7it el check mta' isActif()
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getMotDePasse()
                )
        );

        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Utilisateur non trouvé"
                ));

        // 🚀 El check mta' isActif() tna7a bech t'fout el 401 Unauthorized

        utilisateur.setDerniereConnexion(LocalDateTime.now());
        utilisateurRepository.save(utilisateur);

        String token = jwtService.generateToken(utilisateur);

        return AuthResponse.builder()
                .token(token)
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole().name())
                .build();
    }

    public void demanderResetPassword(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Utilisateur non trouvé"
                ));

        String code = genererCode();
        utilisateur.setCodeResetPassword(code);
        utilisateur.setCodeResetPasswordExpiration(LocalDateTime.now().plusHours(1));
        utilisateurRepository.save(utilisateur);
    }

    public void resetPassword(ResetPasswordRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        if (!utilisateur.getCodeResetPassword().equals(request.getCode())) {
            throw new UnauthorizedException("Code invalide");
        }

        utilisateur.setMotDePasseHash(passwordEncoder.encode(request.getNouveauMotDePasse()));
        utilisateur.setCodeResetPassword(null);
        utilisateur.setCodeResetPasswordExpiration(null);
        utilisateurRepository.save(utilisateur);
    }

    private String genererCode() {
        return String.valueOf((int)(Math.random() * 900000) + 100000);
    }
}