package com.example.plateformeback.stats;

import com.example.plateformeback.publication.PublicationRepository;
import com.example.plateformeback.user.UsersRepository;
import com.example.plateformeback.matiere.MatiereRepository;
import com.example.plateformeback.cours.CoursRepository;
import com.example.plateformeback.exercice.ExerciceRepository; 


import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;


@AllArgsConstructor
@Service
public class StatsService {

    private final UsersRepository usersRepository;
    private final MatiereRepository matiereRepository;
    private final CoursRepository coursRepository;
    private final ExerciceRepository exerciceRepository;
    private final PublicationRepository publicationRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getStats() {
        long publications = publicationRepository.count();
        long resolues = publicationRepository.countByStatut("RESOLUE");
        double taux = publications == 0 ? 0 : Math.round(resolues * 1000.0 / publications) / 10.0;

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("utilisateurs", usersRepository.count());
        stats.put("matieres", matiereRepository.count());
        stats.put("cours", coursRepository.count());
        stats.put("exercices", exerciceRepository.count());
        stats.put("publications", publications);
        stats.put("publicationsResolues", resolues);
        stats.put("tauxResolution", taux);
        return stats;
    }
}
