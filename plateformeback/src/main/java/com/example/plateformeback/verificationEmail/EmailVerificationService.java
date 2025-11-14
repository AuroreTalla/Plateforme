package com.example.plateformeback.verificationEmail;

import com.example.plateformeback.user.Users;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;


import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Slf4j  // ✅ AJOUTÉ
@AllArgsConstructor
@Service
public class EmailVerificationService {

    private final EmailVerificationRepository emailVerificationRepository;
    private final NotificationService notificationService;

    private final SecureRandom random = new SecureRandom();

    @Transactional  // ✅ AJOUTÉ
    public void validation(Users user){
        // ✅ AJOUTÉ : Supprimer anciens codes
        emailVerificationRepository.deleteAllByUsers(user);
        log.info("Génération code pour: {}", user.getEmail());

        EmailVerification emailVerification = new EmailVerification();
        emailVerification.setUsers(user);

        Instant now = Instant.now();
        emailVerification.setDateCreation(now);
        emailVerification.setDateExpiration(now.plus(10, ChronoUnit.MINUTES));

        int randomNumber = 100_000 + random.nextInt(900_000);
        emailVerification.setCode(String.valueOf(randomNumber));

        emailVerificationRepository.save(emailVerification);
        notificationService.notifier(emailVerification);
        log.info("Code envoyé à: {}", user.getEmail());
    }

    public EmailVerification lireEnFonctionDuCode(String code) {
        if (code == null || code.isBlank()) {
            log.warn("Code vide reçu");
            throw new CodeInvalideException("Code manquant");
        }

        EmailVerification ev = emailVerificationRepository.findByCode(code)
                .orElseThrow(() -> {
                    log.warn("Code incorrect: {}", code);
                    return new CodeInvalideException("Code incorrect");
                });

        if (Instant.now().isAfter(ev.getDateExpiration())) {
            log.warn("Code expiré: {}", code);
            throw new CodeInvalideException("Code expiré");
        }

        return ev;
    }

    // ✅ AJOUTÉ : Supprimer une vérification
    @Transactional
    public void deleteVerification(EmailVerification emailVerification) {
        emailVerificationRepository.delete(emailVerification);
        log.info("Code supprimé après activation");
    }

    @Transactional
    @Scheduled(fixedRate = 300_000)
    public void removeExpiredCodes() {
        int deleted = emailVerificationRepository.deleteAllByDateExpirationBefore(Instant.now());
        if (deleted > 0) {
            log.info("Codes expirés supprimés: {}", deleted);
        }
    }
}