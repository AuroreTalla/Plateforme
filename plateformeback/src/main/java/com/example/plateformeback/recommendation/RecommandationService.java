package com.example.plateformeback.recommendation;

import com.example.plateformeback.enums.TypeRessourceConsulte;
import com.example.plateformeback.enums.SourceDonnee;
import com.example.plateformeback.cours.CoursRepository;
import com.example.plateformeback.exercice.ExerciceRepository;
import com.example.plateformeback.publication.PublicationRepository;
import com.example.plateformeback.matiere.MatiereRepository;
import com.example.plateformeback.consultation.ConsultationRepository;
import com.example.plateformeback.matiere.Matiere;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@AllArgsConstructor
@Service
public class RecommandationService implements RecommandationProvider{

    private final CoursRepository coursRepository;
    private final ExerciceRepository exerciceRepository;
    private final PublicationRepository publicationRepository;
    private final MatiereRepository matiereRepository;
    private final ConsultationRepository consultationRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RecommandationDTO> recommander(TypeRessourceConsulte type, Long id, int limite) {
        Long matiereId = resoudreMatiere(type, id);
        if (matiereId == null) return List.of();

        // popularité réelle par ressource, pour ordonner les candidats
        Map<String, Long> lecteurs = new HashMap<>();
        for (TypeRessourceConsulte t : TypeRessourceConsulte.values()) {
            consultationRepository.topParMatiere(matiereId, t, SourceDonnee.REEL, PageRequest.of(0, 100))
                    .forEach(r -> lecteurs.put(t + ":" + r.getRessourceId(), r.getLecteurs()));
        }

        List<RecommandationDTO> candidats = new ArrayList<>();

        coursRepository.findByMatiereIdOrderByOrdreAsc(matiereId).stream()
                .filter(c -> !(type == TypeRessourceConsulte.COURS && c.getId() == id))
                .forEach(c -> candidats.add(new RecommandationDTO("COURS", c.getId(), c.getTitre(), "Même matière", c.getMatiere().getId(), c.getMatiere().getGroupe().getId())));

        exerciceRepository.findByMatiereIdOrderByOrdreAsc(matiereId).stream()
                .filter(e -> !(type == TypeRessourceConsulte.EXERCICE && e.getId() == id))
                .forEach(e -> candidats.add(new RecommandationDTO("EXERCICE", e.getId(), e.getTitre(), "Exercice de la même matière", e.getMatiere().getId(), e.getMatiere().getGroupe().getId())));

        matiereRepository.findById(matiereId).ifPresent(m ->
            publicationRepository.findTop5ByGroupeIdAndStatutOrderByDatePublicationDesc(
                    m.getGroupe().getId(), "NON_RESOLUE").stream()
                .filter(p -> !(type == TypeRessourceConsulte.PUBLICATION && p.getId() == id))
                .forEach(p -> candidats.add(new RecommandationDTO("PUBLICATION", p.getId(), p.getTitre(), "Question en attente dans le forum", m.getId(), m.getGroupe().getId()))));

        return candidats.stream()
                .sorted(Comparator.comparingLong((RecommandationDTO r) ->
                        lecteurs.getOrDefault(r.type() + ":" + r.id(), 0L)).reversed())
                .limit(Math.min(limite, 20))
                .toList();
    }

    private Long resoudreMatiere(TypeRessourceConsulte type, Long id) {
        return switch (type) {
            case COURS -> coursRepository.findById(id).map(c -> c.getMatiere().getId()).orElse(null);
            case EXERCICE -> exerciceRepository.findById(id).map(e -> e.getMatiere().getId()).orElse(null);
            case PUBLICATION -> publicationRepository.findById(id)
                    .flatMap(p -> matiereRepository.findByGroupeId(p.getGroupe().getId()))
                    .map(Matiere::getId).orElse(null);
        };
    }
}