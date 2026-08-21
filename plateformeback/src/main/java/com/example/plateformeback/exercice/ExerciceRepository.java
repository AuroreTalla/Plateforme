package com.example.plateformeback.exercice;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExerciceRepository extends JpaRepository<Exercice, Long> {
    List<Exercice> findByMatiereIdOrderByOrdreAsc(Long matiereId);
    long countByMatiereId(Long matiereId);
}
