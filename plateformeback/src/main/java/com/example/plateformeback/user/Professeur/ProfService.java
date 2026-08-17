package com.example.plateformeback.user.Professeur;

import com.example.plateformeback.enums.TypeStatut;
import com.example.plateformeback.user.Users;
import com.example.plateformeback.user.UsersRepository;
import com.example.plateformeback.verificationEmail.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@AllArgsConstructor
@Service
public class ProfService {

    private final UsersRepository usersRepository;
    private final NotificationService notificationService;

    /**
     * Récupère tous les utilisateurs avec une demande professeur en attente
     */
    public List<Users> getUsersAvecDemandeProfesseur() {
        return usersRepository.findByDemandeProfesseurTrueAndStatut(TypeStatut.ELEVE);
    }

    /**
     * Valide un utilisateur comme professeur
     */
    @Transactional
    public Users validerCommeProfesseur(Long userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));

        // Vérifications
        if (!user.isDemandeProfesseur()) {
            throw new IllegalStateException("Cet utilisateur n'a pas fait de demande professeur");
        }

        if (!TypeStatut.ELEVE.equals(user.getStatut())) {
            throw new IllegalStateException("Seul un élève peut être validé comme professeur");
        }

        // Changement de statut
        user.setStatut(TypeStatut.PROFESSEUR);
        user.setDemandeProfesseur(false);

        Users savedUser = usersRepository.save(user);
        log.info("Utilisateur {} validé comme professeur", user.getEmail());

        return savedUser;
    }

    /**
     * Refuse une demande professeur (sans notification)
     */
    @Transactional
    public Users refuserDemandeProfesseur(Long userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));

        if (!user.isDemandeProfesseur()) {
            throw new IllegalStateException("Cet utilisateur n'a pas de demande professeur en attente");
        }

        // Réinitialiser la demande
        user.setDemandeProfesseur(false);

        Users savedUser = usersRepository.save(user);
        log.info("Demande professeur refusée pour {}", user.getEmail());

        return savedUser;
    }

    /**
     * Notifie tous les admins d'une nouvelle demande professeur
     */
    public void notifierAdminDemandeProfesseur(Users demandeur) {
        List<Users> admins = usersRepository.findByStatut(TypeStatut.ADMIN);

        if (admins.isEmpty()) {
            log.warn("Aucun admin trouvé pour notifier la demande de {}", demandeur.getEmail());
            return;
        }

        for (Users admin : admins) {
            try {
                notificationService.envoyerEmailNouvelleDemandeProf(admin, demandeur);
            } catch (Exception e) {
                log.error("Erreur notification admin {} : {}", admin.getEmail(), e.getMessage());
                // Continue avec les autres admins même si un échoue
            }
        }

        log.info("Notification envoyée à {} admin(s) pour la demande de {}",
                admins.size(), demandeur.getEmail());
    }

    /**
     * Envoie un email de validation au professeur
     */
    public void envoyerEmailValidationProfesseur(Users user) {
        try {
            notificationService.envoyerEmailValidationProfesseur(user);
            log.info("Email de validation envoyé à {}", user.getEmail());
        } catch (Exception e) {
            log.error("Erreur envoi email validation à {} : {}", user.getEmail(), e.getMessage());
            // Ne pas faire échouer la transaction si l'email échoue
        }
    }

    /**
     * Compte le nombre de demandes en attente
     */
    public long compterDemandesEnAttente() {
        return usersRepository.findByDemandeProfesseurTrueAndStatut(TypeStatut.ELEVE).size();
    }
}

