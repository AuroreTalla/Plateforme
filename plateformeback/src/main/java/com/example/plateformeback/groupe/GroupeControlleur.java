package com.example.plateformeback.groupe;

import com.example.plateformeback.message.MessageDTO;
import com.example.plateformeback.user.Users;
import com.example.plateformeback.user.UsersService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping(path = "groupes")
public class GroupeControlleur {

    private final GroupeService groupeService;
    private final UsersService usersService;

    // Créer un groupe
    @PostMapping
    public Groupe creerGroupe(@RequestBody Groupe groupe) {
        return groupeService.creerGroupe(groupe);
    }

    // Rejoindre un groupe
    @PostMapping("/join")
    public ResponseEntity<?> joinGroup(@RequestBody Map<String, String> payload) {
        try {
            Users currentUser = usersService.getCurrentUser();
            String groupeNom = payload.get("nom");

            if (groupeNom == null || groupeNom.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Nom du groupe manquant"));
            }

            log.info("📥 Requête joinGroup: {} par {}", groupeNom, currentUser.getEmail());

            Groupe groupe = groupeService.joinGroupe(groupeNom, currentUser);

            log.info("✅ Join réussi pour {} dans {}", currentUser.getEmail(), groupeNom);

            return ResponseEntity.ok(GroupeDTO.fromEntity(groupe, currentUser));

        } catch (RuntimeException e) {
            log.error("❌ Erreur join: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Récupérer les messages d'un groupe avec pagination
    @GetMapping("/{nom}/messages")
    public ResponseEntity<?> getMessages(
            @PathVariable String nom,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {

        try {
            Users currentUser = usersService.getCurrentUser();

            log.info("📥 Demande messages pour {} par {}", nom, currentUser.getEmail());

            // ✅ Vérifier si membre
            if (!groupeService.isMember(nom, currentUser)) {
                log.warn("⚠️ Utilisateur {} non membre de {}", currentUser.getEmail(), nom);
                return ResponseEntity.status(403).body(Map.of("error", "Vous devez être membre du groupe"));
            }

            Pageable pageable = PageRequest.of(page, size, Sort.by("dateEnvoie").ascending());
            List<MessageDTO> messages = groupeService.getMessagesDTO(nom, pageable);

            log.info("✅ {} messages envoyés pour {}", messages.size(), nom);

            return ResponseEntity.ok(messages);

        } catch (RuntimeException e) {
            log.error("❌ Erreur getMessages: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Récupérer tous les groupes
    @GetMapping
    public List<GroupeDTO> getAllGroupes() {
        Users currentUser = usersService.getCurrentUser();
        return groupeService.getAllGroupesDTO(currentUser);
    }

    // Récupérer le dernier message
    @GetMapping("/{nom}/messages/last")
    public MessageDTO getLastMessage(@PathVariable String nom) {
        return groupeService.getLastMessageDTO(nom);
    }
}