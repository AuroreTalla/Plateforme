package com.example.plateformeback.cours;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.plateformeback.matiere.MatiereCount;
import com.example.plateformeback.matiere.MatiereCount;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CoursRepository extends JpaRepository<Cours, Long> {
    List<Cours> findByMatiereIdOrderByOrdreAsc(Long matiereId);

    long countByMatiereId(Long matiereId);

    @Query("SELECT c.matiere.id AS matiereId, COUNT(c) AS total FROM Cours c GROUP BY c.matiere.id")
List<MatiereCount> countGroupedByMatiere();
}