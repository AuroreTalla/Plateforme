package com.example.plateformeback.user;

import com.example.plateformeback.enums.TypeStatut;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, Long> {

    Optional<Users> findByEmail(String email);
    boolean existsByEmail(String email);

    Optional<Users> findByName(String name);
    boolean existsByName(String name);

    // ✅ Utiliser TypeStatut (enum) au lieu de String
    List<Users> findByStatut(TypeStatut statut);
    List<Users> findByDemandeProfesseurTrueAndStatut(TypeStatut statut);
}