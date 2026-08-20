package com.example.plateformeback.user;

import com.example.plateformeback.user.demandeProfesseur.*;
import com.example.plateformeback.dto.ActivationDTO;
import com.example.plateformeback.dto.AuthentificationDTO;
import com.example.plateformeback.enums.TypeRoleUser;
import com.example.plateformeback.jwt.JwtCookieService;
import com.example.plateformeback.jwt.JwtService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping(path = "users")
public class UsersControlleur {

    private final UsersService usersService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final JwtCookieService jwtCookieService;
    private final DemandeProfesseurService demandeProfesseurService;

    @PostMapping(consumes = APPLICATION_JSON_VALUE, path = "inscription")
    public ResponseEntity<?> inscription(@Valid @RequestBody Users users) {
    log.info("Inscription pour email: {}", users.getEmail());

    boolean demandeProf = TypeRoleUser.PROFESSEUR.equals(users.getStatut());
    users.setStatut(TypeRoleUser.ELEVE);

    Users savedUser = usersService.inscription(users); // voir note ci-dessous : inscription() doit renvoyer Users

    if (demandeProf) {
        demandeProfesseurService.creerDemande(savedUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Compte créé avec succès. Votre demande de statut professeur sera examinée par un administrateur.",
                "statut", TypeRoleUser.ELEVE.name(),
                "demandeProfesseur", true
        ));
    }

    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "message", "Utilisateur créé avec succès. Vérifiez vos emails.",
            "statut", TypeRoleUser.ELEVE.name()
    ));
}

    // -------------------------------
    // 🔹 Activation
    // -------------------------------
    @Transactional
    @PostMapping("activation")
    public ResponseEntity<?> activation(@RequestBody ActivationDTO activationDTO) {
        log.info("Activation request pour: {}", activationDTO.getEmail());
        Users userActive = usersService.activation(activationDTO);
        return ResponseEntity.ok(UserDTO.fromEntity(userActive));
    }

    // -------------------------------
    // 🔹 Connexion
    // -------------------------------
    @PostMapping("connexion")
    public ResponseEntity<?> connexion(@RequestBody AuthentificationDTO dto, HttpServletResponse response) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
            );

            Users user = usersService.getUserByEmail(dto.email());

            if (!user.isEmailVerifie()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Veuillez vérifier votre email avant de vous connecter."));
            }

            // Générer les tokens
            Map<String, String> tokens = jwtService.generateTokens(user);

            // Ajouter dans les cookies
            jwtCookieService.addTokenCookies(response, tokens);

            // ✅ CORRECTION : Renvoyer le token en JSON AUSSI
            return ResponseEntity.ok(Map.of(
                    "user", UserDTO.fromEntity(user),
                    "token", tokens.get(JwtService.BEARER),           // ✅ Ajouté
                    "refreshToken", tokens.get(JwtService.REFRESH)    // ✅ Ajouté
            ));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Email ou mot de passe incorrect."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erreur interne du serveur.", "details", e.getMessage()));
        }
    }

    // -------------------------------
    // 🔹 Refresh Token
    // -------------------------------
    @PostMapping("refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        return jwtCookieService.getOptionalTokenFromCookies(request, JwtService.REFRESH)
                .map(refreshToken -> {
                    try {
                        Map<String, String> tokens = jwtService.refreshTokens(refreshToken);
                        jwtCookieService.addTokenCookies(response, tokens);
                        return ResponseEntity.ok(Map.of("token", tokens.get(JwtService.BEARER)));
                    } catch (RuntimeException e) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("message", "Refresh token invalide ou expiré"));
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Refresh token manquant")));
    }

    // -------------------------------
    // 🔹 Déconnexion
    // -------------------------------
    @PostMapping("deconnexion")
    public ResponseEntity<?> deconnexion(HttpServletResponse response, Authentication auth) {
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            Users user = usersService.getUserByEmail(auth.getName());
            jwtService.deconnexion(user);
        }
        jwtCookieService.clearTokens(response);
        return ResponseEntity.ok(Map.of("message", "Déconnexion réussie"));
    }

    // -------------------------------
    // 🔹 Informations utilisateur
    // -------------------------------
    @GetMapping("/email/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
        Users user = usersService.getUserByEmail(email);
        return ResponseEntity.ok(UserDTO.fromEntity(user));
    }

    @GetMapping(path = "exists", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> userExists(@RequestParam String email) {
        return this.usersService.userExists(email);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<UserDTO> getUserByName(@PathVariable String name) {
        Users user = usersService.getUserByName(name);
        return ResponseEntity.ok(UserDTO.fromEntity(user));
    }

    @GetMapping
@PreAuthorize("hasRole('ADMIN')")
public List<UserDTO> getAllUsers() {
    return usersService.getAllUsers();
}

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof org.springframework.security.core.userdetails.UserDetails userDetails) {
                Users user = usersService.getUserByEmail(userDetails.getUsername());
                return ResponseEntity.ok(UserDTO.fromEntity(user));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } catch (Exception e) {
            log.error("Erreur interne lors de /me", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erreur interne lors de la récupération de l'utilisateur courant"));
        }
    }
}
