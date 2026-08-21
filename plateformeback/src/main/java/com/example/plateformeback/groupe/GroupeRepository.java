package com.example.plateformeback.groupe;

import com.example.plateformeback.message.Message;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GroupeRepository extends JpaRepository<Groupe, Long> {

    // Nouvelle méthode simple sans EntityGraph
    @Query("SELECT g FROM Groupe g WHERE LOWER(TRIM(g.nom)) = LOWER(TRIM(:nom))")
    Optional<Groupe> findByNom(@Param("nom") String nom);

    @Query("SELECT g FROM Groupe g WHERE g.id = :id")
    Optional<Groupe> findById(@Param("id") Long id);

    @Query("SELECT m FROM Message m WHERE m.groupe.id = :id ORDER BY m.dateEnvoie ASC")
    List<Message> findMessagesByGroupeId(@Param("id") Long id, Pageable pageable);

    List<Groupe> findAll();
}
