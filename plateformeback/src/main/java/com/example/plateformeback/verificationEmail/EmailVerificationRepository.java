package com.example.plateformeback.verificationEmail;

import com.example.plateformeback.user.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {

    Optional<EmailVerification> findByCode(String code);

    @Modifying
    @Query("DELETE FROM EmailVerification e WHERE e.dateExpiration < :now")
    int deleteAllByDateExpirationBefore(@Param("now") Instant now);

    @Modifying
    void deleteAllByUsers(Users user);
}