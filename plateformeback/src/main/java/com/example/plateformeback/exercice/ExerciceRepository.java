package com.example.plateformeback.exercice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.plateformeback.matiere.MatiereCount;
import com.example.plateformeback.matiere.MatiereCount;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExerciceRepository extends JpaRepository<Exercice, Long> {
    List<Exercice> findByMatiereIdOrderByOrdreAsc(Long matiereId);
    long countByMatiereId(Long matiereId);

    @Query("SELECT e.matiere.id AS matiereId, COUNT(e) AS total FROM Exercice e GROUP BY e.matiere.id")
List<MatiereCount> countGroupedByMatiere();
}
