package com.example.plateformeback.matiere;

import com.example.plateformeback.cours.CoursDTO;
import com.example.plateformeback.exercice.ExerciceDTO;
import com.example.plateformeback.enums.TypeContenu;
import lombok.AllArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/matieres")
public class MatiereControlleur {

    private final MatiereService matiereService;

    @GetMapping
    public List<MatiereDTO> getAll() {
        return matiereService.getAllMatieres();
    }

    @GetMapping("/{id}")
    public MatiereDTO getById(@PathVariable Long id) {
        return matiereService.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public MatiereDTO creer(@RequestBody Map<String, String> payload) {
        return matiereService.creerMatiere(payload.get("nom"), payload.get("description"));
    }

    @DeleteMapping("/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> supprimerMatiere(@PathVariable Long id) {
    matiereService.supprimerMatiere(id);
    return ResponseEntity.ok(Map.of("message", "Matière supprimée avec succès"));
}

    @GetMapping("/{matiereId}/cours")
    public List<CoursDTO> getCours(@PathVariable Long matiereId) {
        return matiereService.getCoursByMatiere(matiereId);
    }

    @PostMapping("/{matiereId}/cours")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSEUR')")
    public CoursDTO ajouterCours(@PathVariable Long matiereId, @RequestBody Map<String, Object> payload) {
        return matiereService.ajouterCours(
                matiereId,
                (String) payload.get("titre"),
                TypeContenu.valueOf((String) payload.get("type")),
                (String) payload.get("contenu"),
                (String) payload.get("mediaUrl"),
                payload.get("ordre") != null ? (int) payload.get("ordre") : 0
        );
    }

    @DeleteMapping("/cours/{coursId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSEUR')")
    public void supprimerCours(@PathVariable Long coursId) {
        matiereService.supprimerCours(coursId);
    }

    @GetMapping("/{matiereId}/exercices")
    public List<ExerciceDTO> getExercices(@PathVariable Long matiereId) {
        return matiereService.getExercicesByMatiere(matiereId);
    }

    @PostMapping("/{matiereId}/exercices")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSEUR')")
    public ExerciceDTO ajouterExercice(@PathVariable Long matiereId, @RequestBody Map<String, Object> payload) {
        return matiereService.ajouterExercice(
                matiereId,
                (String) payload.get("titre"),
                TypeContenu.valueOf((String) payload.get("type")),
                (String) payload.get("contenu"),
                (String) payload.get("mediaUrl"),
                payload.get("ordre") != null ? (int) payload.get("ordre") : 0
        );
    }

    @DeleteMapping("/exercices/{exerciceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSEUR')")
    public void supprimerExercice(@PathVariable Long exerciceId) {
        matiereService.supprimerExercice(exerciceId);
    }
}