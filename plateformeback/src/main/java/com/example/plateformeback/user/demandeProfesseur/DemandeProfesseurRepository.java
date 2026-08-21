package com.example.plateformeback.user.demandeProfesseur;

import com.example.plateformeback.enums.TypeStatutDemande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import java.util.List;
import java.util.Optional;

public interface DemandeProfesseurRepository extends JpaRepository<DemandeProfesseur, Long> {
    @EntityGraph(attributePaths = "users")
    List<DemandeProfesseur> findByStatut(TypeStatutDemande statut);
   
    Optional<DemandeProfesseur> findByUsersIdAndStatut(Long userId, TypeStatutDemande statut);
    
    List<DemandeProfesseur> findByUsersId(Long userId);
}