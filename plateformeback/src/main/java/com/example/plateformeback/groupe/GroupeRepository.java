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

    @EntityGraph(attributePaths = "membres")
    Optional<Groupe> findByNom(String nom);

    @Query("SELECT m FROM Message m WHERE m.groupe.nom = :nom ORDER BY m.dateEnvoie ASC")
    List<Message> findMessagesByGroupeNom(@Param("nom") String nom, Pageable pageable);

    @EntityGraph(attributePaths = "membres")
    List<Groupe> findAll();

}
