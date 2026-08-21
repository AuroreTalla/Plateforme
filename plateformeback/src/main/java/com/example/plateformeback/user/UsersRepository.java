package com.example.plateformeback.user;

import com.example.plateformeback.enums.TypeRoleUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, Long> {

    Optional<Users> findByEmail(String email);
    boolean existsByEmail(String email);

    Optional<Users> findByName(String name);
    boolean existsByName(String name);

    // ✅ Utiliser TypeRoleUser (enum) au lieu de String
    List<Users> findByStatut(TypeRoleUser statut);
}