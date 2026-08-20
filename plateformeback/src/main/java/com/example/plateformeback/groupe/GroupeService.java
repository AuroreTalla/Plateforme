package com.example.plateformeback.groupe;

import com.example.plateformeback.message.Message;
import com.example.plateformeback.message.MessageDTO;
import com.example.plateformeback.message.MessageRepository;
import com.example.plateformeback.user.Users;
import jakarta.persistence.EntityManager;
import org.springframework.dao.DataIntegrityViolationException;
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
    public void supprimerGroupe(Long id) {
    if (!groupeRepository.existsById(id)) {
        throw new RuntimeException("Groupe non trouvé : " + id);
    }

    try {
        groupeRepository.deleteById(id);
        log.info("Groupe {} supprimé", id);
    } catch (DataIntegrityViolationException e) {
        log.warn("Impossible de supprimer le groupe {} : matière associée", id);
        throw new IllegalStateException(
            "Impossible de supprimer ce groupe : une matière y est encore associée. Supprimez d'abord la matière."
        );
    }
}

    // Méthode joinGroupe supprimée pour ne plus gérer l’adhésion
    // La logique est retirée pour éviter tout blocage

    public List<GroupeDTO> getAllGroupesDTO(Users currentUser) {
        List<Groupe> groupes = groupeRepository.findAll();
        return groupes.stream()
                .map(g -> GroupeDTO.fromEntity(g, currentUser))
                .toList();
    }

    public GroupeDTO findByIdDTO(Long id, Users currentUser) {
        return groupeRepository.findById(id)
                .map(g -> GroupeDTO.fromEntity(g, currentUser))
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé"));
    }

    public List<MessageDTO> getMessagesDTO(Long id, Pageable pageable) {
        return groupeRepository.findMessagesByGroupeId(id, pageable).stream()
                .map(MessageDTO::fromEntity)
                .toList();
    }

    public MessageDTO getLastMessageDTO(Long id) {
        Groupe groupe = groupeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé"));

        Message last = messageRepository.findTop1ByGroupeOrderByDateEnvoieDesc(groupe);

        if (last == null) {
            return null;
        }

        return MessageDTO.fromEntity(last);
    }

    public Groupe findById(Long id) {
        log.info("🔎 Recherche du groupe : '{}'", id);

    List<Groupe> groupes = groupeRepository.findAll();

    groupes.forEach(g ->
            log.info("📚 Groupe BD -> ID={}, NOM='{}'",
                    g.getId(),
                    g.getNom())
    );

        return groupeRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Groupe non trouvé : " + id));
    }

    // Les méthodes isMember et checkUserMember sont commentées car inutilisées
}
