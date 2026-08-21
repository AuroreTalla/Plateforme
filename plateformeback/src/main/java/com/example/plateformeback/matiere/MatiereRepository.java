package com.example.plateformeback.matiere;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MatiereRepository extends JpaRepository<Matiere, Long> {
    boolean existsByNom(String nom);
    Optional<Matiere> findByGroupeId(Long groupeId);
}