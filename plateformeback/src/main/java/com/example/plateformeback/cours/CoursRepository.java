package com.example.plateformeback.cours;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CoursRepository extends JpaRepository<Cours, Long> {
    List<Cours> findByMatiereIdOrderByOrdreAsc(Long matiereId);
}