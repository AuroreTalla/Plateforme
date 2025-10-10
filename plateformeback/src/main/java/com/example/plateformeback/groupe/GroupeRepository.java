package com.example.plateformeback.groupe;

import com.example.plateformeback.message.Message;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GroupeRepository extends JpaRepository<Groupe, Long> {

    // Chercher un groupe par son nom
    Optional<Groupe> findByNom(String nom);

    // Récupérer les messages d'un groupe par nom avec pagination
    @Query("SELECT m FROM Message m WHERE m.groupe.nom = :nom ORDER BY m.dateEnvoie ASC")
    List<Message> findMessagesByGroupeNom(@Param("nom") String nom, Pageable pageable);

    @Query("SELECT DISTINCT g FROM Groupe g LEFT JOIN FETCH g.membres")
    List<Groupe> findAllWithMembres();

    @EntityGraph(attributePaths = "membres")
    List<Groupe> findAll();
}
