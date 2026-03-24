package com.example.pfegestionsportive.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationCode(String email, String nom, String code) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(email);
        mail.setSubject("🏉 Rugby Tunisie — Vérification de votre compte");
        mail.setText(
                "Bonjour " + nom + ",\n\n" +
                        "Votre code de vérification est :\n\n" +
                        "👉  " + code + "\n\n" +
                        "Ce code est valable 10 minutes.\n\n" +
                        "L'équipe Rugby Tunisie 🏉"
        );
        mailSender.send(mail);
    }

    public void sendResetCode(String email, String nom, String code) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(email);
        mail.setSubject("🔑 Rugby Tunisie — Réinitialisation mot de passe");
        mail.setText(
                "Bonjour " + nom + ",\n\n" +
                        "Votre code de réinitialisation est :\n\n" +
                        "👉  " + code + "\n\n" +
                        "Ce code est valable 10 minutes.\n\n" +
                        "L'équipe Rugby Tunisie 🏉"
        );
        mailSender.send(mail);
    }

    public void sendWelcomeEmail(String email, String nom) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(email);
        mail.setSubject("✅ Rugby Tunisie — Compte vérifié avec succès");
        mail.setText(
                "Bonjour " + nom + ",\n\n" +
                        "Votre compte est maintenant actif !\n" +
                        "Vous pouvez vous connecter.\n\n" +
                        "L'équipe Rugby Tunisie 🏉"
        );
        mailSender.send(mail);
    }

    public void sendStatusChangeEmail(String email, String nom,
                                      String sujet, String contenu) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(email);
        mail.setSubject(sujet);
        mail.setText(contenu);
        mailSender.send(mail);
    }
}
