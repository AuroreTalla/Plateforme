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
@Table(name = "refresh_token")
public class RefreshToken {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private boolean expire;

        @Column(name = "valeur", nullable = false, unique = true, length = 512)
        private String valeur;

        private Instant creation;
        private Instant expiration;

        public boolean isExpired() {
            return expiration != null && Instant.now().isAfter(expiration);
        }

        public boolean isActive() {
            return !expire && !isExpired();
        }

        @ManyToOne
        @JoinColumn(name = "user_id", nullable = false)
        private Users users;

}
