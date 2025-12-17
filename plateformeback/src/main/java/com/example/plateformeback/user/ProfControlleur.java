package com.example.plateformeback.user;

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
@RequestMapping(path = "admin/professeurs")
public class ProfControlleur {

    private final ProfService profService;

    /**
     * Liste toutes les demandes professeur en attente
     */
    @GetMapping("/demandes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDemandesProfesseur() {
        try {
            List<Users> demandes = profService.getUsersAvecDemandeProfesseur();
            List<UserDTO> demandeDTOs = demandes.stream()
                    .map(UserDTO::fromEntity)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                    "demandes", demandeDTOs,
                    "total", demandeDTOs.size()
            ));
        } catch (Exception e) {
            log.error("Erreur récupération demandes: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erreur lors de la récupération des demandes"));
        }
    }

    /**
     * Valide un utilisateur comme professeur
     */
    @PostMapping("/valider/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> validerProfesseur(@PathVariable Long userId) {
        try {
            Users user = profService.validerCommeProfesseur(userId);
            profService.envoyerEmailValidationProfesseur(user);

            return ResponseEntity.ok(Map.of(
                    "message", "L'utilisateur a été validé comme professeur",
                    "user", UserDTO.fromEntity(user)
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

    /**
     * Refuse une demande professeur
     */
    @PostMapping("/refuser/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> refuserProfesseur(@PathVariable Long userId) {
        try {
            Users user = profService.refuserDemandeProfesseur(userId);

            return ResponseEntity.ok(Map.of(
                    "message", "Demande professeur refusée",
                    "user", UserDTO.fromEntity(user)
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

    /**
     * Compte le nombre de demandes en attente
     */
    @GetMapping("/demandes/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> compterDemandes() {
        try {
            long count = profService.compterDemandesEnAttente();
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            log.error("Erreur comptage demandes: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erreur lors du comptage"));
        }
    }
}
