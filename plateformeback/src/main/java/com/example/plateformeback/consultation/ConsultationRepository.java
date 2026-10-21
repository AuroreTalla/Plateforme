package com.example.plateformeback.consultation;

import com.example.plateformeback.enums.SourceDonnee;
import com.example.plateformeback.enums.TypeRessourceConsulte;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;


import java.time.LocalDateTime;
import java.util.List;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    boolean existsByUserIdAndTypeRessourceAndRessourceIdAndDateConsultationAfter(
            Long userId, TypeRessourceConsulte type, Long ressourceId, LocalDateTime after);

            @Query("""
    SELECT c.ressourceId AS ressourceId,
           COUNT(c) AS vues,
           COUNT(DISTINCT c.userId) AS lecteurs
    FROM Consultation c
    WHERE c.matiereId = :matiereId
      AND c.typeRessource = :type
      AND c.source = :source
    GROUP BY c.ressourceId
    ORDER BY COUNT(c) DESC
    """)
List<RessourceCount> topParMatiere(
        @Param("matiereId") Long matiereId,
        @Param("type") TypeRessourceConsulte type,
        @Param("source") SourceDonnee source,
        Pageable pageable);
}
