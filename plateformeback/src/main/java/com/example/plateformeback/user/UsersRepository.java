package com.example.plateformeback.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, Long> {

    Optional<Users> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Users> findByName(String name);

    boolean existsByName(String name);

    List<Users> findByStatut(String statut);

    // ✅ Nouvelle méthode
    List<Users> findByDemandeProfesseurTrueAndStatut(String statut);

}
