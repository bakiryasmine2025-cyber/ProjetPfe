package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.exception.ResourceNotFoundException;
import com.example.pfegestionsportive.model.entity.Utilisateur;
import com.example.pfegestionsportive.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final UtilisateurRepository utilisateurRepository;

    // ✅ Vérifier email
    public void verifierEmail(String email, String code) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Utilisateur non trouvé avec l'email: " + email
                ));

        if (!utilisateur.getCodeVerification().equals(code)) {
            throw new RuntimeException("Code de vérification invalide");
        }
        if (utilisateur.getCodeVerificationExpiration().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Code expiré, demandez un nouveau");
        }

        utilisateur.setActif(true);
        utilisateur.setCodeVerification(null);
        utilisateur.setCodeVerificationExpiration(null);
        utilisateurRepository.save(utilisateur);
    }

    // ✅ Renvoyer code vérification
    public void renvoyerCodeVerification(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Utilisateur non trouvé avec l'email: " + email
                ));

        String code = genererCode();
        utilisateur.setCodeVerification(code);
        utilisateur.setCodeVerificationExpiration(
                LocalDateTime.now().plusMinutes(10)
        );
        utilisateurRepository.save(utilisateur);
        sendVerificationEmail(email, code);
    }

    public void sendVerificationEmail(String to, String code) {
        String subject = "Vérification de votre email - PFE Sportive";
        String message = String.join("\n",
                "Bonjour,",
                "",
                "Merci de vous être inscrit sur PFE Gestion Sportive.",
                "",
                "Votre code de vérification est:",
                "==============================",
                "        " + code,
                "==============================",
                "",
                "Ce code expire dans 10 minutes.",
                "",
                "Si vous n'avez pas créé de compte, ignorez cet email.",
                "",
                "Cordialement,",
                "L'équipe PFE Gestion Sportive"
        );
        sendEmail(to, subject, message);
    }

    public void sendPasswordResetEmail(String to, String code) {
        String subject = "Réinitialisation de votre mot de passe - PFE Sportive";
        String message = String.join("\n",
                "Bonjour,",
                "",
                "Vous avez demandé une réinitialisation de mot de passe.",
                "",
                "Votre code de réinitialisation est:",
                "==============================",
                "        " + code,
                "==============================",
                "",
                "Ce code expire dans 1 heure.",
                "",
                "Si vous n'avez pas demandé cette réinitialisation,",
                "ignorez cet email et votre mot de passe restera inchangé.",
                "",
                "Cordialement,",
                "L'équipe PFE Gestion Sportive"
        );
        sendEmail(to, subject, message);
    }

    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom("bakiryasmine2@gmail.com");
        mailSender.send(message);
    }

    private String genererCode() {
        return String.valueOf((int)(Math.random() * 900000) + 100000);
    }
}