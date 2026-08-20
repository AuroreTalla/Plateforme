package com.example.plateformeback.user;

import com.example.plateformeback.user.demandeProfesseur.*;
import com.example.plateformeback.dto.ActivationDTO;
import com.example.plateformeback.verificationEmail.EmailVerification;
import com.example.plateformeback.verificationEmail.EmailVerificationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@AllArgsConstructor
@Service
public class UsersService implements UserDetailsService {

    private final UsersRepository usersRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;
    private final DemandeProfesseurService demandeProfesseurService;  // ✅ Injection de DemandeProfesseurService

    @Transactional
    public Users inscription(Users users) {
        users.setPassword(this.passwordEncoder.encode(users.getPassword()));
        users = this.usersRepository.save(users);
        this.emailVerificationService.validation(users);
    return users;
    }

    @Transactional
    public Users activation(ActivationDTO activationDTO) {
    String code = activationDTO.getCode();
    String email = activationDTO.getEmail();

    if (code == null || code.isBlank()) {
        throw new IllegalArgumentException("Code manquant");
    }
    if (email == null || email.isBlank()) {
        throw new IllegalArgumentException("Email manquant");
    }

    EmailVerification emailVerification = this.emailVerificationService.lireEnFonctionDuCode(code);

    if (!emailVerification.getUsers().getEmail().equals(email)) {
        throw new IllegalArgumentException("Email et code ne correspondent pas");
    }

    if (Instant.now().isAfter(emailVerification.getDateExpiration())) {
        throw new IllegalArgumentException("Votre code est expiré");
    }

    Users userActive = this.usersRepository.findById(emailVerification.getUsers().getId())
            .orElseThrow(() -> new EntityNotFoundException("Utilisateur inconnu"));

    userActive.setEmailVerifie(true);
    emailVerificationService.deleteVerification(emailVerification);
    Users savedUser = this.usersRepository.save(userActive);

    // Notifier les admins uniquement une fois le compte réellement activé
    if (demandeProfesseurService.aUneDemandeEnAttente(savedUser.getId())) {
        demandeProfesseurService.notifierAdminDemandeProfesseur(savedUser);
    }

    return savedUser;
}

    // Méthodes existantes pour Spring Security et gestion utilisateurs
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

    public List<UserDTO> getAllUsers() {
    return usersRepository.findAll()
            .stream()
            .map(UserDTO::fromEntity)
            .toList();
}
}