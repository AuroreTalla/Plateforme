package com.example.plateformeback.password;

import com.example.plateformeback.user.Users;
import com.example.plateformeback.user.UsersRepository;
import com.example.plateformeback.verificationEmail.CodeInvalideException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Slf4j
@AllArgsConstructor
@Service
public class PasswordResetService {

    private final PasswordResetRepository passwordResetRepository;
    private final UsersRepository usersRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JavaMailSender javaMailSender;

    private final SecureRandom random = new SecureRandom();

    @Transactional
    public void demanderReinitialisation(String email) {
        Users user = usersRepository.findByEmail(email).orElse(null);

        // Ne jamais révéler si l'email existe ou non — évite l'énumération de comptes
        if (user == null) {
            log.warn("Demande de réinitialisation pour un email inconnu : {}", email);
            return;
        }

        passwordResetRepository.deleteAllByUsersId(user.getId());

        PasswordReset reset = new PasswordReset();
        reset.setUsers(user);
        reset.setDateCreation(Instant.now());
        reset.setDateExpiration(Instant.now().plus(15, ChronoUnit.MINUTES));

        int codeNumerique = 100_000 + random.nextInt(900_000);
        reset.setCode(String.valueOf(codeNumerique));

        passwordResetRepository.save(reset);
        envoyerEmail(user, reset.getCode());
    }

    @Transactional
    public void reinitialiser(String code, String nouveauMotDePasse) {
        if (code == null || code.isBlank()) {
            throw new CodeInvalideException("Code manquant");
        }
        if (nouveauMotDePasse == null || nouveauMotDePasse.length() < 8) {
            throw new IllegalArgumentException("Le mot de passe doit contenir au moins 8 caractères");
        }

        PasswordReset reset = passwordResetRepository.findByCode(code)
                .orElseThrow(() -> new CodeInvalideException("Code incorrect"));

        if (Instant.now().isAfter(reset.getDateExpiration())) {
            throw new CodeInvalideException("Code expiré");
        }

        Users user = reset.getUsers();
        user.setPassword(passwordEncoder.encode(nouveauMotDePasse));
        usersRepository.save(user);

        passwordResetRepository.delete(reset);
        log.info("Mot de passe réinitialisé pour {}", user.getEmail());
    }

    private void envoyerEmail(Users user, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@prepasconcours.com");
            message.setTo(user.getEmail());
            message.setSubject("Réinitialisation de votre mot de passe");
            message.setText(String.format(
                    "Bonjour %s,\n\nVoici votre code de réinitialisation : %s\n\n" +
                    "Ce code expire dans 15 minutes.\n\n" +
                    "Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.",
                    user.getName(), code
            ));
            javaMailSender.send(message);
        } catch (Exception e) {
            log.error("Erreur envoi email réinitialisation : {}", e.getMessage());
        }
    }
}