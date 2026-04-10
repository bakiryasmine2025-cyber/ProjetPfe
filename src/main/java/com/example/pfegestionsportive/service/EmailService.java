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
        send(email,
                "Rugby Tunisie — Verification de votre compte",
                "Bonjour " + nom + ",\n\n" +
                        "Votre code de verification est :\n\n" +
                        "   " + code + "\n\n" +
                        "Ce code est valable 10 minutes.\n\n" +
                        "L'equipe Rugby Tunisie");
    }

    public void sendResetCode(String email, String nom, String code) {
        send(email,
                "Rugby Tunisie — Reinitialisation mot de passe",
                "Bonjour " + nom + ",\n\n" +
                        "Votre code de reinitialisation est :\n\n" +
                        "   " + code + "\n\n" +
                        "Ce code est valable 10 minutes.\n\n" +
                        "L'equipe Rugby Tunisie");
    }

    public void sendWelcomeEmail(String email, String nom) {
        send(email,
                "Rugby Tunisie — Compte verifie avec succes",
                "Bonjour " + nom + ",\n\n" +
                        "Votre compte est maintenant actif !\n" +
                        "Vous pouvez vous connecter.\n\n" +
                        "L'equipe Rugby Tunisie");
    }

    public void sendStatusChangeEmail(String email, String nom,
                                      String sujet, String contenu) {
        send(email, sujet, contenu);
    }

    // ── approval flow ──

    public void sendApprovalRequestNotification(String adminEmail, String adminNom,
                                                String userNom, String userEmail,
                                                String role) {
        send(adminEmail,
                "Rugby Tunisie — Nouvelle demande de compte",
                "Bonjour " + adminNom + ",\n\n" +
                        "Une nouvelle demande de compte est en attente d'approbation :\n\n" +
                        "   Nom    : " + userNom + "\n" +
                        "   Email  : " + userEmail + "\n" +
                        "   Role   : " + role + "\n\n" +
                        "Connectez-vous au panneau Super Admin pour approuver ou rejeter.\n\n" +
                        "L'equipe Rugby Tunisie");
    }

    public void sendAccountApprovedEmail(String email, String nom, String role) {
        send(email,
                "Rugby Tunisie — Votre compte a ete approuve",
                "Bonjour " + nom + ",\n\n" +
                        "Bonne nouvelle ! Votre compte " + role + " a ete approuve.\n" +
                        "Vous pouvez maintenant vous connecter.\n\n" +
                        "L'equipe Rugby Tunisie");
    }

    public void sendAccountRejectedEmail(String email, String nom, String motif) {
        send(email,
                "Rugby Tunisie — Votre demande de compte",
                "Bonjour " + nom + ",\n\n" +
                        "Nous avons examine votre demande de compte.\n" +
                        "Malheureusement, elle n'a pas pu etre approuvee.\n" +
                        (motif != null ? "Motif : " + motif + "\n" : "") +
                        "\nPour plus d'informations, contactez l'administration.\n\n" +
                        "L'equipe Rugby Tunisie");
    }

    public void sendTempPassword(String email, String nom, String tempPassword) {
        send(email,
                "Rugby Tunisie — Reinitialisation de votre mot de passe",
                "Bonjour " + nom + ",\n\n" +
                        "Votre mot de passe a ete reinitialise par l'administrateur.\n\n" +
                        "Mot de passe temporaire : " + tempPassword + "\n\n" +
                        "Connectez-vous et changez-le immediatement.\n\n" +
                        "L'equipe Rugby Tunisie");
    }

    // ── helper interne ──

    private void send(String to, String subject, String text) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(to);
        mail.setSubject(subject);
        mail.setText(text);
        mailSender.send(mail);
    }
}