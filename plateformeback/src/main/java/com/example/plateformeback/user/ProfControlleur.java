package com.example.plateformeback.user;

import com.example.plateformeback.jwt.JwtCookieService;
import com.example.plateformeback.jwt.JwtService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping(path = "prof")
public class ProfControlleur {

    private final UsersService usersService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final JwtCookieService jwtCookieService;

    // -------------------------------
    // 🔹 ENDPOINTS ADMIN - Gestion des demandes professeurs
    // -------------------------------

    @GetMapping("/admin/demandes-professeur")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDemandesProfesseur() {
        List<Users> demandes = usersService.getUsersAvecDemandeProfesseur();
        List<UserDTO> demandeDTOs = demandes.stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(demandeDTOs);
    }

    @PostMapping("/admin/valider-professeur/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> validerProfesseur(@PathVariable Long userId) {
        try {
            Users user = usersService.validerCommeProfesseur(userId);

            // ✅ Envoyer un email de confirmation à l'utilisateur
            usersService.envoyerEmailValidationProfesseur(user);

            return ResponseEntity.ok(Map.of(
                    "message", "L'utilisateur a été validé comme professeur",
                    "user", UserDTO.fromEntity(user)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/admin/refuser-professeur/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> refuserProfesseur(@PathVariable Long userId, @RequestBody Map<String, String> body) {
        try {
            String raison = body.get("raison");
            Users user = usersService.refuserDemandeProfesseur(userId, raison);

            return ResponseEntity.ok(Map.of(
                    "message", "Demande refusée",
                    "user", UserDTO.fromEntity(user)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
