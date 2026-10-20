package com.example.plateformeback.consultation;

import com.example.plateformeback.enums.SourceDonnee;
import com.example.plateformeback.enums.TypeRessourceConsulte;
import com.example.plateformeback.matiere.Matiere;
import com.example.plateformeback.matiere.MatiereRepository;
import com.example.plateformeback.cours.Cours;
import com.example.plateformeback.cours.CoursRepository;
import com.example.plateformeback.exercice.Exercice;
import com.example.plateformeback.exercice.ExerciceRepository;


import com.example.plateformeback.publication.Publication;
import com.example.plateformeback.publication.PublicationRepository;
import com.example.plateformeback.user.Users;
import jakarta.persistence.EntityNotFoundException;
//import jakarta.transaction.Transactional;
import org.springframework.transaction.annotation.Transactional;

import lombok.AllArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


import java.util.stream.Collectors;
@AllArgsConstructor
@Service
public class ConsultationService {

    private static final int FENETRE_DEDUP_MINUTES = 30;

    private final ConsultationRepository consultationRepository;
    private final CoursRepository coursRepository;
    private final ExerciceRepository exerciceRepository;
    private final PublicationRepository publicationRepository;
    private final MatiereRepository matiereRepository;

    @Transactional
    public void enregistrer(Users user, TypeRessourceConsulte type, Long ressourceId) {
        LocalDateTime limite = LocalDateTime.now().minusMinutes(FENETRE_DEDUP_MINUTES);
        if (consultationRepository
                .existsByUserIdAndTypeRessourceAndRessourceIdAndDateConsultationAfter(
                        user.getId(), type, ressourceId, limite)) {
            return; // déjà comptée récemment
        }

        Long matiereId = resoudreMatiere(type, ressourceId); // lève une exception si la ressource n'existe pas

        Consultation c = new Consultation();
        c.setUserId(user.getId());
        c.setTypeRessource(type);
        c.setRessourceId(ressourceId);
        c.setMatiereId(matiereId);
        consultationRepository.save(c);
    }

    private Long resoudreMatiere(TypeRessourceConsulte type, Long id) {
        return switch (type) {
            case COURS -> coursRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Cours introuvable"))
                    .getMatiere().getId();
            case EXERCICE -> exerciceRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Exercice introuvable"))
                    .getMatiere().getId();
            case PUBLICATION -> {
                Publication p = publicationRepository.findById(id)
                        .orElseThrow(() -> new EntityNotFoundException("Publication introuvable"));
                yield matiereRepository.findByGroupeId(p.getGroupe().getId())
                        .map(Matiere::getId).orElse(null);
            }
        };
    }

    @Transactional(readOnly = true)
public List<RessourcePopulaireDTO> populaires(Long matiereId, TypeRessourceConsulte type, int limite) {
    List<RessourceCount> top = consultationRepository.topParMatiere(
            matiereId, type, SourceDonnee.REEL, PageRequest.of(0, Math.min(limite, 50)));

    List<Long> ids = top.stream().map(RessourceCount::getRessourceId).toList();

    Map<Long, String> titres = switch (type) {
        case COURS -> coursRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Cours::getId, Cours::getTitre));
        case EXERCICE -> exerciceRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Exercice::getId, Exercice::getTitre));
        case PUBLICATION -> publicationRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Publication::getId, Publication::getTitre));
    };

    return top.stream()
            .filter(r -> titres.containsKey(r.getRessourceId())) // ignore les ressources supprimées
            .map(r -> new RessourcePopulaireDTO(type.name(), r.getRessourceId(),
                    titres.get(r.getRessourceId()), r.getVues(), r.getLecteurs()))
            .toList();
}
}
