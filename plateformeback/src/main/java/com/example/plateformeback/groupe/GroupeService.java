package com.example.plateformeback.groupe;

import jakarta.persistence.EntityManager;
import org.springframework.dao.DataIntegrityViolationException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

@Slf4j
@AllArgsConstructor
@Service
public class GroupeService {

    private final GroupeRepository groupeRepository;
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

    public List<GroupeDTO> getAllGroupesDTO() {
    return groupeRepository.findAll().stream()
            .map(GroupeDTO::fromEntity)
            .toList();
}

public GroupeDTO findByIdDTO(Long id) {
    return groupeRepository.findById(id)
            .map(GroupeDTO::fromEntity)
            .orElseThrow(() -> new RuntimeException("Groupe non trouvé"));
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
