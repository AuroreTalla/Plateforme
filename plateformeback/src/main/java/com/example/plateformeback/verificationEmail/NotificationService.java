package com.example.plateformeback.verificationEmail;

import com.example.plateformeback.user.Users;
import lombok.AllArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;


@Slf4j  // ✅ AJOUTÉ
@AllArgsConstructor
@Service
public class NotificationService {

    private final JavaMailSender javaMailSender;

    public void notifier(EmailVerification emailVerification){
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@prepasconcours.com");
            message.setTo(emailVerification.getUsers().getEmail());
            message.setSubject("Votre code d'activation");

            String texte = String.format(
                    "Bonjour %s,\n\n" +
                            "Votre code d'activation est : %s\n\n" +
                            "Ce code expire dans 10 minutes.\n\n" +
                            "Si vous n'avez pas demandé ce code, ignorez cet email.",
                    emailVerification.getUsers().getName(),
                    emailVerification.getCode()
            );
            message.setText(texte);

            javaMailSender.send(message);
            log.info("Email envoyé à: {}", emailVerification.getUsers().getEmail());

        } catch (Exception e) {
            log.error("Erreur envoi email: {}", e.getMessage());
            throw new RuntimeException("Impossible d'envoyer l'email de vérification", e);
        }
    }

    // ✅ Envoyer email de validation
    public void envoyerEmailValidationProfesseur(Users user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@prepasconcours.com");
            message.setTo(user.getEmail());
            message.setSubject("Demande de statut professeur validée");

            String texte = String.format(
                    "Bonjour %s,\n\n" +
                            "Votre demande de statut professeur a été validée par l'administrateur.\n" +
                            "Vous pouvez maintenant accéder à toutes les fonctionnalités réservées aux professeurs.\n\n" +
                            "Cordialement,\nL'équipe",
                    user.getName()
            );
            message.setText(texte);

            javaMailSender.send(message);
            log.info("Email envoyé à: {}", user.getEmail());

        } catch (Exception e) {
            log.error("Erreur envoi email: {}", e.getMessage());
            throw new RuntimeException("Impossible d'envoyer l'email de vérification", e);
        }
    }
}
