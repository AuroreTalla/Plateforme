package com.example.plateformeback.user;

import com.example.plateformeback.enums.TypeStatut;
import com.example.plateformeback.verificationEmail.EmailVerificationService;
import com.example.plateformeback.verificationEmail.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@AllArgsConstructor
@Service
public class ProfService {

    private final UsersRepository usersRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;
    private final NotificationService notificationService;

    // ✅ Récupérer tous les utilisateurs avec demande professeur en attente
    public List<Users> getUsersAvecDemandeProfesseur() {
        return usersRepository.findByDemandeProfesseurTrueAndStatut("ELEVE");
    }

    // ✅ Valider un utilisateur comme professeur
    @Transactional
    public Users validerCommeProfesseur(Long userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!user.isDemandeProfesseur()) {
            throw new RuntimeException("Cet utilisateur n'a pas fait de demande professeur");
        }

        if (!"ELEVE".equals(user.getStatut())) {
            throw new RuntimeException("Cet utilisateur n'est pas un élève");
        }

        // ✅ Changer le statut
        user.setStatut(TypeStatut.PROFESSEUR);
        user.setDemandeProfesseur(false); // Réinitialiser la demande

        return usersRepository.save(user);
    }

    // ✅ Refuser une demande professeur
    @Transactional
    public Users refuserDemandeProfesseur(Long userId, String raison) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Réinitialiser la demande
        user.setDemandeProfesseur(false);

        // Envoyer un email de refus
        emailService.envoyerEmailRefusProfesseur(user, raison);

        return usersRepository.save(user);
    }

    // ✅ Notifier l'admin d'une nouvelle demande
    public void notifierAdminDemandeProfesseur(Users user) {
        // Récupérer tous les admins
        List<Users> admins = usersRepository.findByStatut("ADMIN");

        for (Users admin : admins) {
            emailService.envoyerEmailNouvelleDemandeProf(admin, user);
        }
    }


}



