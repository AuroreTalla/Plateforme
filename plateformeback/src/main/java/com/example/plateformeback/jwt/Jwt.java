package com.example.plateformeback.jwt;

import com.example.plateformeback.user.Users;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "jwt")
public class Jwt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "valeur", nullable = false, unique = true, columnDefinition = "TEXT")
    private String valeur; // stocke le hash hex (sha-256)

    @Column(name = "desactive")
    private boolean desactive;

    // si tu veux garder un flag "expire" : garder cohérence avec dateExpiration
    @Column(name = "expire")
    private boolean expire;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "refresh_token_id")
    private RefreshToken refreshToken;

    @Column(name = "date_expiration")
    private LocalDateTime dateExpiration;

    public boolean isExpired() {
        return dateExpiration != null && LocalDateTime.now().isAfter(dateExpiration);
    }

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE})
    @JoinColumn(name = "user_id", nullable = false)
    private Users users;

    public void setValeur(String valeur) {
        this.valeur = sha256Hex(valeur);
    }

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
