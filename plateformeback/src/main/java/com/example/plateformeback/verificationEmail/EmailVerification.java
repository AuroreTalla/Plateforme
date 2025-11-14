package com.example.plateformeback.verificationEmail;

import com.example.plateformeback.user.Users;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "email_verification")
public class EmailVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "date_expiration", nullable = false)
    private Instant dateExpiration;

    @Column(name = "date_creation", nullable = false)
    private Instant dateCreation;

    @ManyToOne(fetch = FetchType.LAZY) // permet plusieurs codes par utilisateur
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private Users users;
}
