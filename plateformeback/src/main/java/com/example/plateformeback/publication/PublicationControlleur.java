package com.example.plateformeback.publication;

import com.example.plateformeback.groupe.Groupe;
import com.example.plateformeback.groupe.GroupeService;
import com.example.plateformeback.user.Users;
import com.example.plateformeback.user.UsersService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/publications")
public class PublicationControlleur {

    private final UsersService usersService;
    private final GroupeService groupeService;
    private final PublicationService publicationService;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/groupe/{groupeId}")
    public PageResponse<PublicationDTO> getPublicationsByGroupe(
            @PathVariable Long groupeId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return publicationService.searchPublications(groupeId, search, page, size);
    }

    @Transactional
    @MessageMapping("/sendpublication/{groupeId}")
    public void sendpublication(
            @DestinationVariable Long groupeId,
            @Payload Map<String, String> payload
    ) {
        try {
            String userEmail = payload.get("userEmail");

            if (userEmail == null || userEmail.isEmpty()) {
                log.error("❌ Email utilisateur manquant");
                return;
            }

            Users currentUser = usersService.getUserByEmail(userEmail);
            Groupe groupe = groupeService.findById(groupeId);

            Publication publication = new Publication();
            publication.setContent(payload.get("content"));
            publication.setTitre(payload.get("titre"));
            publication.setSender(currentUser);
            publication.setGroupe(groupe);

            PublicationDTO savedpublication = publicationService.sendpublication(publication);

            log.info("✅ publication sauvegardée: ID={}", savedpublication.id());

            messagingTemplate.convertAndSend(
                    "/topic/groupe/" + groupeId,
                    savedpublication
            );

        } catch (Exception e) {
            log.error("❌ Erreur envoi publication", e);
        }
    }

    @GetMapping("/groupe/{groupeId}/non-resolues/count")
public ResponseEntity<?> compterNonResolues(@PathVariable Long groupeId) {
    long count = publicationService.compterNonResoluesParGroupe(groupeId);
    return ResponseEntity.ok(Map.of("count", count));
}
}