package com.example.plateformeback.publication;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface PublicationRepository extends JpaRepository<Publication, Long> {
    List<Publication> findByGroupeId(Long groupeId);

    @Query("SELECT p FROM Publication p WHERE p.groupe.id = :groupeId " +
           "AND (:keyword IS NULL OR " +
           "LOWER(p.titre) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY p.datePublication DESC")
    Page<Publication> searchByGroupe(
            @Param("groupeId") Long groupeId,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
