package com.example.plateformeback.verificationEmail;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Integer> {

    Optional<EmailVerification> findByCode(String code);

    void deleteAllByDateExpirationBefore(Instant now); // pour nettoyer codes expirés
}
