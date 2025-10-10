package com.example.plateformeback.verificationEmail;

import lombok.AllArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class NotificationService {

    private final JavaMailSender javaMailSender;

    public void notifier(EmailVerification emailVerification){
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("noreply@prepasconcours.com"); // adresse valide SMTP
        message.setTo(emailVerification.getUsers().getEmail());
        message.setSubject("Votre code d'activation");

        String texte = String.format(
                "Bonjour %s,\n" +
                        "Votre code d'activation est : %s\n" +
                        "Ce code expire dans 10 minutes.",
                emailVerification.getUsers().getUsername(),
                emailVerification.getCode()
        );
        message.setText(texte);

        javaMailSender.send(message);
    }
}
