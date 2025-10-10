package com.example.plateformeback.verificationEmail;

import com.example.plateformeback.user.Users;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@AllArgsConstructor
@Service
public class EmailVerificationService {

    private final EmailVerificationRepository emailVerificationRepository;
    private final NotificationService notificationService;

    private final SecureRandom random = new SecureRandom();

    public void validation(Users user){
        EmailVerification emailVerification = new EmailVerification();
        emailVerification.setUsers(user);

        Instant now = Instant.now();
        emailVerification.setDateCreation(now);
        emailVerification.setDateExpiration(now.plus(10, ChronoUnit.MINUTES));

        int randomNumber = 100_000 + random.nextInt(900_000); // toujours 6 chiffres
        emailVerification.setCode(String.valueOf(randomNumber));

        emailVerificationRepository.save(emailVerification);
        notificationService.notifier(emailVerification);
    }

    public EmailVerification lireEnFonctionDuCode(String code) {
        if (code == null || code.isBlank()) {
            throw new CodeInvalideException("Code manquant");
        }

        EmailVerification ev = emailVerificationRepository.findByCode(code)
                .orElseThrow(() -> new CodeInvalideException("Code incorrect"));

        if (Instant.now().isAfter(ev.getDateExpiration())) {
            throw new CodeInvalideException("Code expiré");
        }

        return ev;
    }

    // Nettoyage automatique des codes expirés toutes les 5 minutes
    @Transactional
    @Scheduled(fixedRate = 300_000)
    public void removeExpiredCodes() {
        emailVerificationRepository.deleteAllByDateExpirationBefore(Instant.now());
    }
}
