package com.example.plateformeback.jwt;

import com.example.plateformeback.user.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByValeur(String valeur);  // valeur hashée

    void deleteAllByUsers(Users user);

    void deleteAllByExpirationBefore(Instant now);  // Nettoyage automatique
}
