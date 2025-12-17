package com.example.plateformeback.verificationEmail;

import com.example.plateformeback.user.Users;
import lombok.AllArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@AllArgsConstructor
@Service
public class NotificationService {

    private final JavaMailSender javaMailSender;

    /**
     * Envoie le code d'activation par email
     */
    public void notifier(EmailVerification emailVerification) {
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
            log.info("Email d'activation envoyé à: {}", emailVerification.getUsers().getEmail());

        } catch (Exception e) {
            log.error("Erreur envoi email d'activation: {}", e.getMessage());
            throw new RuntimeException("Impossible d'envoyer l'email de vérification", e);
        }
    }

    /**
     * Envoie un email de validation au professeur
     */
    public void envoyerEmailValidationProfesseur(Users user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@prepasconcours.com");
            message.setTo(user.getEmail());
            message.setSubject("✅ Demande de statut professeur validée");

            String texte = String.format(
                    "Bonjour %s,\n\n" +
                            "Excellente nouvelle ! 🎉\n\n" +
                            "Votre demande de statut professeur a été validée par l'administrateur.\n" +
                            "Vous pouvez maintenant accéder à toutes les fonctionnalités réservées aux professeurs.\n\n" +
                            "Reconnectez-vous pour profiter de vos nouveaux privilèges.\n\n" +
                            "Cordialement,\n" +
                            "L'équipe PrepAs Concours",
                    user.getName()
            );
            message.setText(texte);

            javaMailSender.send(message);
            log.info("Email de validation professeur envoyé à: {}", user.getEmail());

        } catch (Exception e) {
            log.error("Erreur envoi email validation professeur: {}", e.getMessage());
            throw new RuntimeException("Impossible d'envoyer l'email de validation", e);
        }
    }

    /**
     * ✅ AJOUTÉ : Notifie l'admin d'une nouvelle demande professeur
     */
    public void envoyerEmailNouvelleDemandeProf(Users admin, Users demandeur) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@prepasconcours.com");
            message.setTo(admin.getEmail());
            message.setSubject("🔔 Nouvelle demande de statut professeur");

            String texte = String.format(
                    "Bonjour %s,\n\n" +
                            "Une nouvelle demande de statut professeur a été soumise :\n\n" +
                            "📋 Informations du demandeur :\n" +
                            "• Nom : %s\n" +
                            "• Email : %s\n" +
                            "• Date d'inscription : %s\n\n" +
                            "Veuillez examiner cette demande dans le panneau d'administration.\n\n" +
                            "Lien : https://votresite.com/admin/professeurs/demandes\n\n" +
                            "Cordialement,\n" +
                            "Système PrepAs Concours",
                    admin.getName(),
                    demandeur.getName(),
                    demandeur.getEmail(),
                    demandeur.getDateInscription()
            );
            message.setText(texte);

            javaMailSender.send(message);
            log.info("Email notification admin envoyé à: {}", admin.getEmail());

        } catch (Exception e) {
            log.error("Erreur envoi email notification admin {} : {}", admin.getEmail(), e.getMessage());
            // Ne pas bloquer l'inscription si l'email admin échoue
        }
    }
}