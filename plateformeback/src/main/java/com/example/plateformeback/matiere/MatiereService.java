package com.example.plateformeback.matiere;

import com.example.plateformeback.cours.*;
import com.example.plateformeback.exercice.*;
import com.example.plateformeback.enums.TypeContenu;
import com.example.plateformeback.groupe.Groupe;
import com.example.plateformeback.groupe.GroupeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@AllArgsConstructor
@Slf4j
@Service
public class MatiereService {

    private final MatiereRepository matiereRepository;
    private final GroupeRepository groupeRepository;
    private final CoursRepository coursRepository;
    private final ExerciceRepository exerciceRepository;

    public List<MatiereDTO> getAllMatieres() {
    return matiereRepository.findAll().stream()
            .map(m -> MatiereDTO.fromEntity(
                    m,
                    coursRepository.countByMatiereId(m.getId()),
                    exerciceRepository.countByMatiereId(m.getId())
            ))
            .toList();
}

public MatiereDTO getById(Long id) {
    Matiere matiere = findEntity(id);
    return MatiereDTO.fromEntity(
            matiere,
            coursRepository.countByMatiereId(id),
            exerciceRepository.countByMatiereId(id)
    );
}


    public Matiere findEntity(Long id) {
        return matiereRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matière introuvable : " + id));
    }

    @Transactional
    public MatiereDTO creerMatiere(String nom, String description) {
        if (matiereRepository.existsByNom(nom)) {
            throw new IllegalStateException("Une matière avec ce nom existe déjà.");
        }

        Groupe groupe = new Groupe();
        groupe.setNom(nom);
        groupe.setDescription(description);
        Groupe savedGroupe = groupeRepository.save(groupe);

        Matiere matiere = new Matiere();
        matiere.setNom(nom);
        matiere.setDescription(description);
        matiere.setGroupe(savedGroupe);

        Matiere saved = matiereRepository.save(matiere);
        return MatiereDTO.fromEntity(saved, 0, 0);
    }

    @Transactional
    public void supprimerMatiere(Long matiereId) {
    Matiere matiere = findEntity(matiereId);
    Long groupeId = matiere.getGroupe().getId();

    // 1. Supprime la matière — cascade automatique sur cours/exercice
    matiereRepository.delete(matiere);

    // 2. Le groupe n'est plus référencé, on peut le supprimer à son tour
    groupeRepository.deleteById(groupeId);

    log.info("Matière {} et son groupe {} supprimés", matiereId, groupeId);
}

    // ---- Cours ----

    public List<CoursDTO> getCoursByMatiere(Long matiereId) {
        return coursRepository.findByMatiereIdOrderByOrdreAsc(matiereId).stream().map(CoursDTO::fromEntity).toList();
    }

    @Transactional
    public CoursDTO ajouterCours(Long matiereId, String titre, TypeContenu type, String contenu, String mediaUrl, int ordre) {
        Matiere matiere = findEntity(matiereId);
        validerCoherence(type, contenu, mediaUrl);

        Cours cours = new Cours();
        cours.setMatiere(matiere);
        cours.setTitre(titre);
        cours.setType(type);
        cours.setContenu(type == TypeContenu.TEXTE ? contenu : null);
        cours.setMediaUrl(type != TypeContenu.TEXTE ? mediaUrl : null);
        cours.setOrdre(ordre);

        return CoursDTO.fromEntity(coursRepository.save(cours));
    }

    @Transactional
    public void supprimerCours(Long coursId) {
        coursRepository.deleteById(coursId);
    }

    // ---- Exercices ----

    public List<ExerciceDTO> getExercicesByMatiere(Long matiereId) {
        return exerciceRepository.findByMatiereIdOrderByOrdreAsc(matiereId).stream().map(ExerciceDTO::fromEntity).toList();
    }

    @Transactional
    public ExerciceDTO ajouterExercice(Long matiereId, String titre, TypeContenu type, String contenu, String mediaUrl, int ordre) {
        Matiere matiere = findEntity(matiereId);
        validerCoherence(type, contenu, mediaUrl);

        Exercice exercice = new Exercice();
        exercice.setMatiere(matiere);
        exercice.setTitre(titre);
        exercice.setType(type);
        exercice.setContenu(type == TypeContenu.TEXTE ? contenu : null);
        exercice.setMediaUrl(type != TypeContenu.TEXTE ? mediaUrl : null);
        exercice.setOrdre(ordre);

        return ExerciceDTO.fromEntity(exerciceRepository.save(exercice));
    }

    @Transactional
    public void supprimerExercice(Long exerciceId) {
        exerciceRepository.deleteById(exerciceId);
    }

    private void validerCoherence(TypeContenu type, String contenu, String mediaUrl) {
        if (type == TypeContenu.TEXTE && (contenu == null || contenu.isBlank())) {
            throw new IllegalArgumentException("Le contenu texte est requis pour ce type.");
        }
        if (type != TypeContenu.TEXTE && (mediaUrl == null || mediaUrl.isBlank())) {
            throw new IllegalArgumentException("L'URL du média est requise pour ce type.");
        }
    }
}
