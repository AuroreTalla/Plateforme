package com.example.plateformeback.user.professeur;

import com.example.plateformeback.enums.TypeStatutDemande;
import com.example.plateformeback.user.demandeProfesseur.DemandeProfesseur;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProfRepository extends JpaRepository<DemandeProfesseur, Long> {
    List<DemandeProfesseur> findByStatut(TypeStatutDemande statut);
    Optional<DemandeProfesseur> findByUsersIdAndStatut(Long userId, TypeStatutDemande statut);
    List<DemandeProfesseur> findByUsersId(Long userId);
}