package com.example.plateformeback.user;

import com.example.plateformeback.dto.ActivationDTO;
import com.example.plateformeback.verificationEmail.EmailVerification;
import com.example.plateformeback.verificationEmail.EmailVerificationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@Service
public class UsersService implements UserDetailsService {

    private final UsersRepository usersRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;

    public void inscription(Users users) {
        users.setPassword(this.passwordEncoder.encode(users.getPassword()));
        users = this.usersRepository.save(users);
        this.emailVerificationService.validation(users);
    }

    public Users activation(ActivationDTO activationDTO) {
        // 🔹 Récupération du code et de l'email côté backend
        String code = activationDTO.getCode();
        String email = activationDTO.getEmail();

        if (code == null || code.isBlank()) {
            throw new RuntimeException("Code manquant");
        }
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email manquant");
        }

        // 🔹 Lire la vérification email par code et email
        EmailVerification emailVerification = this.emailVerificationService.lireEnFonctionDuCode(code);

        if (!emailVerification.getUsers().getEmail().equals(email)) {
            throw new RuntimeException("Email et code ne correspondent pas");
        }

        if (Instant.now().isAfter(emailVerification.getDateExpiration())) {
            throw new RuntimeException("Votre code est expiré");
        }

        // 🔹 Activation du compte
        Users userActive = this.usersRepository.findById(emailVerification.getUsers().getId())
                .orElseThrow(() -> new RuntimeException("Utilisateur inconnu"));

        userActive.setEmailVerifie(true);
        return this.usersRepository.save(userActive);
    }


    //spring security
    @Override
    public Users loadUserByUsername(String email) throws UsernameNotFoundException {
        return this.usersRepository
                .findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Aucun utilisateur ne correspond à cet identifiant"));
    }

    public Users getUserByEmail(String email) {
        return usersRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec email : " + email));
    }

    public ResponseEntity<Boolean> userExists(String email) {
        boolean exists = usersRepository.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    public Users getUserByName(String username) {
        return usersRepository.findByName(username)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec ce username : " + username));
    }

    public Users findByName(String name) {
        return usersRepository.findByName(name).orElse(null);
    }

    public boolean existsByName(String username) {
        return usersRepository.existsByName(username);
    }

    public Users getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usersRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé : " + email));
    }
}
