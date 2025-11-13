package com.example.plateformeback.jwt;

import com.example.plateformeback.user.Users;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

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

        @Column(name = "valeur", nullable = false, unique = true, length = 512)
        private String valeur;  // ✅ Stocke directement le hash

        @Column(name = "desactive")
        private boolean desactive;

        @Column(name = "expire")
        private boolean expire;

        @OneToOne(cascade = CascadeType.ALL)
        @JoinColumn(name = "refresh_token_id")
        private RefreshToken refreshToken;

        @Column(name = "date_expiration")
        private Instant dateExpiration;

        public boolean isExpired() {
            return dateExpiration != null && Instant.now().isAfter(dateExpiration);
        }

        @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE})
        @JoinColumn(name = "user_id", nullable = false)
        private Users users;
 }

