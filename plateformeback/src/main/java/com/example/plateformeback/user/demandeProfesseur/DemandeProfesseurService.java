package com.example.plateformeback.user.demandeProfesseur;

import com.example.plateformeback.enums.TypeStatutDemande;
import com.example.plateformeback.enums.TypeRoleUser;

import com.example.plateformeback.user.Users;
import com.example.plateformeback.user.UsersRepository;
import com.example.plateformeback.verificationEmail.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@AllArgsConstructor
@Service
public class DemandeProfesseurService {

    private final DemandeProfesseurRepository demandeProfesseurRepository;
    private final UsersRepository usersRepository;
    private final NotificationService notificationService;

    @Transactional
    public DemandeProfesseur creerDemande(Users user) {
        DemandeProfesseur demande = new DemandeProfesseur();
        demande.setUsers(user);
        demande.setStatut(TypeStatutDemande.EN_ATTENTE);
        return demandeProfesseurRepository.save(demande);
    }

    public boolean aUneDemandeEnAttente(Long userId) {
        return demandeProfesseurRepository.findByUsersIdAndStatut(userId, TypeStatutDemande.EN_ATTENTE).isPresent();
    }

    public List<DemandeProfesseur> getDemandesEnAttente() {
        return demandeProfesseurRepository.findByStatut(TypeStatutDemande.EN_ATTENTE);
    }

    public List<DemandeProfesseur> getHistorique() {
        List<DemandeProfesseur> validees = demandeProfesseurRepository.findByStatut(TypeStatutDemande.VALIDEE);
        List<DemandeProfesseur> refusees = demandeProfesseurRepository.findByStatut(TypeStatutDemande.REFUSEE);
        List<DemandeProfesseur> revoquees = demandeProfesseurRepository.findByStatut(TypeStatutDemande.REVOQUEE);

        return java.util.stream.Stream.of(validees, refusees, revoquees)
                .flatMap(List::stream)
                .toList();
    }

    @Transactional
    public DemandeProfesseur valider(Long demandeId) {
        DemandeProfesseur demande = demandeProfesseurRepository.findById(demandeId)
                .orElseThrow(() -> new EntityNotFoundException("Demande introuvable"));

        if (demande.getStatut() != TypeStatutDemande.EN_ATTENTE) {
            throw new IllegalStateException("Cette demande n'est pas en attente");
        }

        Users user = demande.getUsers();
        user.setStatut(TypeRoleUser.PROFESSEUR);
        usersRepository.save(user);

        demande.setStatut(TypeStatutDemande.VALIDEE);
        demande.setDateValidation(LocalDateTime.now());
        DemandeProfesseur saved = demandeProfesseurRepository.save(demande);

        log.info("Demande {} validée pour {}", demandeId, user.getEmail());
        return saved;
    }

    @Transactional
    public DemandeProfesseur refuser(Long demandeId) {
        DemandeProfesseur demande = demandeProfesseurRepository.findById(demandeId)
                .orElseThrow(() -> new EntityNotFoundException("Demande introuvable"));

        if (demande.getStatut() != TypeStatutDemande.EN_ATTENTE) {
            throw new IllegalStateException("Cette demande n'est pas en attente");
        }

        demande.setStatut(TypeStatutDemande.REFUSEE);
        demande.setDateValidation(LocalDateTime.now());
        DemandeProfesseur saved = demandeProfesseurRepository.save(demande);

        log.info("Demande {} refusée pour {}", demandeId, demande.getUsers().getEmail());
        return saved;
    }

    @Transactional
    public DemandeProfesseur revoquer(Long demandeId) {
        DemandeProfesseur demande = demandeProfesseurRepository.findById(demandeId)
                .orElseThrow(() -> new EntityNotFoundException("Demande introuvable"));

        if (demande.getStatut() != TypeStatutDemande.VALIDEE) {
            throw new IllegalStateException("Seule une demande validée peut être révoquée");
        }

        Users user = demande.getUsers();
        user.setStatut(TypeRoleUser.ELEVE);
        usersRepository.save(user);

        demande.setStatut(TypeStatutDemande.REVOQUEE);
        demande.setDateValidation(LocalDateTime.now());
        DemandeProfesseur saved = demandeProfesseurRepository.save(demande);

        log.info("Statut professeur révoqué pour {}", user.getEmail());
        return saved;
    }

    public long compterDemandesEnAttente() {
    return demandeProfesseurRepository.findByStatut(TypeStatutDemande.EN_ATTENTE).size();
}

    public void notifierAdminDemandeProfesseur(Users demandeur) {
        List<Users> admins = usersRepository.findByStatut(TypeRoleUser.ADMIN);

        if (admins.isEmpty()) {
            log.warn("Aucun admin trouvé pour notifier la demande de {}", demandeur.getEmail());
            return;
        }

        for (Users admin : admins) {
            try {
                notificationService.envoyerEmailNouvelleDemandeProf(admin, demandeur);
            } catch (Exception e) {
                log.error("Erreur notification admin {} : {}", admin.getEmail(), e.getMessage());
            }
        }

        log.info("Notification envoyée à {} admin(s) pour la demande de {}", admins.size(), demandeur.getEmail());
    }

    public void envoyerEmailValidationProfesseur(Users user) {
        try {
            notificationService.envoyerEmailValidationProfesseur(user);
        } catch (Exception e) {
            log.error("Erreur envoi email validation à {} : {}", user.getEmail(), e.getMessage());
        }
    }
}