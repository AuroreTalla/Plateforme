package com.example.plateformeback.user.demandeProfesseur;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping(path = "/professeurs/demandes")
public class DemandeProfesseurControlleur {

    private final DemandeProfesseurService demandeProfesseurService;

    @GetMapping("/en-attente")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDemandesEnAttente() {
        try {
            List<DemandeProfesseurDTO> demandes = demandeProfesseurService.getDemandesEnAttente()
                    .stream()
                    .map(DemandeProfesseurDTO::fromEntity)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of("demandes", demandes, "total", demandes.size()));
        } catch (Exception e) {
            log.error("Erreur récupération demandes: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erreur lors de la récupération des demandes"));
        }
    }

    @GetMapping("/historique")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getHistorique() {
        try {
            List<DemandeProfesseurDTO> historique = demandeProfesseurService.getHistorique()
                    .stream()
                    .map(DemandeProfesseurDTO::fromEntity)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of("historique", historique, "total", historique.size()));
        } catch (Exception e) {
            log.error("Erreur récupération historique: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erreur lors de la récupération de l'historique"));
        }
    }

    @PostMapping("/valider/{demandeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> valider(@PathVariable Long demandeId) {
        try {
            DemandeProfesseur demande = demandeProfesseurService.valider(demandeId);
            demandeProfesseurService.envoyerEmailValidationProfesseur(demande.getUsers());

            return ResponseEntity.ok(Map.of(
                    "message", "L'utilisateur a été validé comme professeur",
                    "demande", DemandeProfesseurDTO.fromEntity(demande)
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("Erreur validation professeur: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erreur lors de la validation"));
        }
    }

    @PostMapping("/refuser/{demandeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> refuser(@PathVariable Long demandeId) {
        try {
            DemandeProfesseur demande = demandeProfesseurService.refuser(demandeId);

            return ResponseEntity.ok(Map.of(
                    "message", "Demande professeur refusée",
                    "demande", DemandeProfesseurDTO.fromEntity(demande)
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("Erreur refus professeur: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erreur lors du refus"));
        }
    }

    @PostMapping("/revoquer/{demandeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> revoquer(@PathVariable Long demandeId) {
        try {
            DemandeProfesseur demande = demandeProfesseurService.revoquer(demandeId);

            return ResponseEntity.ok(Map.of(
                    "message", "Le statut professeur a été révoqué",
                    "demande", DemandeProfesseurDTO.fromEntity(demande)
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("Erreur révocation professeur: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erreur lors de la révocation"));
        }
    }

    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> compterDemandes() {
        try {
            long count = demandeProfesseurService.compterDemandesEnAttente();
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            log.error("Erreur comptage demandes: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erreur lors du comptage"));
        }
    }
}