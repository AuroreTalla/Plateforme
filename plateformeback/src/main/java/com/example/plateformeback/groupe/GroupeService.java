package com.example.plateformeback.groupe;

import com.example.plateformeback.message.Message;
import com.example.plateformeback.message.MessageDTO;
import com.example.plateformeback.message.MessageRepository;
import com.example.plateformeback.user.Users;
import jakarta.persistence.EntityManager;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@AllArgsConstructor
@Service
public class GroupeService {

    private final GroupeRepository groupeRepository;
    private final MessageRepository messageRepository;
    private final EntityManager entityManager;

    public Groupe creerGroupe(Groupe groupe) {
        return groupeRepository.save(groupe);
    }

    @Transactional
    public Groupe joinGroupe(String nom, Users user) {
        Groupe groupe = groupeRepository.findByNom(nom)
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé"));

        // ✅ Utiliser == au lieu de equals() pour les primitifs
        boolean isMember = groupe.getMembres().stream()
                .anyMatch(membre -> membre.getId() == user.getId());

        if (!isMember) {
            log.info("➕ Ajout membre: {} (ID={}) au groupe: {}",
                    user.getEmail(), user.getId(), nom);

            groupe.getMembres().add(user);

            // ✅ Sauvegarder et forcer le flush
            groupe = groupeRepository.saveAndFlush(groupe);

            // ✅ Vider le cache Hibernate
            entityManager.clear();

            // ✅ Recharger le groupe pour vérifier
            groupe = groupeRepository.findByNom(nom)
                    .orElseThrow(() -> new RuntimeException("Groupe non trouvé"));

            log.info("✅ Membre persisté. Membres actuels: {}",
                    groupe.getMembres().stream()
                            .map(m -> m.getEmail() + " (ID=" + m.getId() + ")")
                            .toList());

        } else {
            log.info("⚠️ Utilisateur {} (ID={}) déjà membre de {}",
                    user.getEmail(), user.getId(), nom);
        }

        return groupe;
    }

    public List<GroupeDTO> getAllGroupesDTO(Users currentUser) {
        List<Groupe> groupes = groupeRepository.findAll();
        return groupes.stream()
                .map(g -> GroupeDTO.fromEntity(g, currentUser))
                .toList();
    }

    public GroupeDTO findByNomDTO(String nom, Users currentUser) {
        return groupeRepository.findByNom(nom)
                .map(g -> GroupeDTO.fromEntity(g, currentUser))
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé"));
    }

    public List<MessageDTO> getMessagesDTO(String nom, Pageable pageable) {
        return groupeRepository.findMessagesByGroupeNom(nom, pageable).stream()
                .map(MessageDTO::fromEntity)
                .toList();
    }

    public MessageDTO getLastMessageDTO(String nom) {
        Groupe groupe = groupeRepository.findByNom(nom)
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé"));

        Message last = messageRepository.findTop1ByGroupeOrderByDateEnvoieDesc(groupe);

        if (last == null) {
            return null;
        }

        return MessageDTO.fromEntity(last);
    }

    public Groupe findByNom(String nom) {
        return groupeRepository.findByNom(nom)
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé"));
    }

    // ✅ Correction avec ==
    public boolean isMember(String nom, Users user) {
        Groupe groupe = groupeRepository.findByNom(nom)
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé"));

        boolean isMember = groupe.getMembres().stream()
                .anyMatch(membre -> membre.getId() == user.getId());  // ✅ == au lieu de .equals()

        List<String> membresInfo = groupe.getMembres().stream()
                .map(m -> m.getEmail() + " (ID=" + m.getId() + ")")
                .toList();

        log.info("🔍 Vérification membre {} (ID={}) pour groupe {} : {} | Membres: {}",
                user.getEmail(), user.getId(), nom, isMember, membresInfo);

        return isMember;
    }

    // ✅ Correction avec ==
    public void checkUserMember(Groupe groupe, Users user) {
        Groupe refreshedGroupe = groupeRepository.findById(groupe.getId())
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé"));

        boolean isMember = refreshedGroupe.getMembres().stream()
                .anyMatch(membre -> membre.getId() == user.getId());  // ✅ == au lieu de .equals()

        if (!isMember) {
            log.error("❌ Utilisateur {} (ID={}) n'est PAS membre de {} (ID={})",
                    user.getEmail(), user.getId(),
                    refreshedGroupe.getNom(), refreshedGroupe.getId());
            throw new IllegalArgumentException("L'utilisateur n'est pas membre du groupe");
        }

        log.info("✅ Utilisateur {} (ID={}) est membre de {} (ID={})",
                user.getEmail(), user.getId(),
                refreshedGroupe.getNom(), refreshedGroupe.getId());
    }
}