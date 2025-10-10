package com.example.plateformeback.jwt;

import com.example.plateformeback.user.Users;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "refresh_token")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean expire;

    @Column(name = "valeur", nullable = false, unique = true, columnDefinition = "TEXT")
    private String valeur;

    private Instant creation;
    private Instant expiration;

    public boolean isExpired() {
        return expiration != null && Instant.now().isAfter(expiration);
    }

    public boolean isActive() {
        return !expire && !isExpired();
    }

    public void setValeur(String valeur) {
        this.valeur = sha256Hex(valeur);
    }

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users users;

    private static String sha256Hex(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(2 * hash.length);
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
