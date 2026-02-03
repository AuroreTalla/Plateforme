package com.example.plateformeback.verificationEmail;

import com.example.plateformeback.user.Users;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service 
public class NotificationService {

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.sender.email:noreplyprepasconcours@gmail.com}")
    private String senderEmail;

    @Value("${brevo.sender.name:PrepAs Concours}")
    private String senderName;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    /**
     * Envoie un email via l'API Brevo
     */
    private void envoyerEmail(String destinataire, String sujet, String contenu) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("sender", Map.of("name", senderName, "email", senderEmail));
            body.put("to", List.of(Map.of("email", destinataire)));
            body.put("subject", sujet);
            body.put("textContent", contenu);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(BREVO_API_URL, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Email envoyé à: {}", destinataire);
            } else {
                log.error("Erreur Brevo: {}", response.getBody());
                throw new RuntimeException("Erreur envoi email");
            }
        } catch (Exception e) {
            log.error("Erreur envoi email à {}: {}", destinataire, e.getMessage());
            throw new RuntimeException("Impossible d'envoyer l'email", e);
        }
    }

    /**
     * Envoie le code d'activation par email
     */
    public void notifier(EmailVerification emailVerification) {
        String texte = String.format(
                "Bonjour %s,\n\n" +
                        "Votre code d'activation est : %s\n\n" +
                        "Ce code expire dans 10 minutes.\n\n" +
                        "Si vous n'avez pas demandé ce code, ignorez cet email.",
                emailVerification.getUsers().getName(),
                emailVerification.getCode()
        );
        envoyerEmail(
                emailVerification.getUsers().getEmail(),
                "Votre code d'activation",
                texte
        );
    }

    /**
     * Envoie un email de validation au professeur
     */
    public void envoyerEmailValidationProfesseur(Users user) {
        String texte = String.format(
                "Bonjour %s,\n\n" +
                        "Votre demande de statut professeur a été validée par l'administrateur.\n" +
                        "Vous pouvez maintenant accéder à toutes les fonctionnalités réservées aux professeurs.\n\n" +
                        "Reconnectez-vous pour profiter de vos nouveaux privilèges.\n\n" +
                        "Cordialement,\n" +
                        "L'équipe PrepAs Concours",
                user.getName()
        );
        envoyerEmail(user.getEmail(), "✅ Demande de statut professeur validée", texte);
    }

    /**
     * Notifie l'admin d'une nouvelle demande professeur
     */
    public void envoyerEmailNouvelleDemandeProf(Users admin, Users demandeur) {
        try {
            String texte = String.format(
                    "Bonjour %s,\n\n" +
                            "Une nouvelle demande de statut professeur a été soumise :\n\n" +
                            "📋 Informations du demandeur :\n" +
                            "• Nom : %s\n" +
                            "• Email : %s\n" +
                            "• Date d'inscription : %s\n\n" +
                            "Veuillez examiner cette demande dans le panneau d'administration.\n\n" +
                            "Cordialement,\n" +
                            "Système PrepAs Concours",
                    admin.getName(),
                    demandeur.getName(),
                    demandeur.getEmail(),
                    demandeur.getDateInscription()
            );
            envoyerEmail(admin.getEmail(), "🔔 Nouvelle demande de statut professeur", texte);
        } catch (Exception e) {
            log.error("Erreur envoi email notification admin {} : {}", admin.getEmail(), e.getMessage());
        }
    }
}