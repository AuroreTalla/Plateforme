package com.example.plateformeback.publication;

import com.example.plateformeback.groupe.Groupe;
import com.example.plateformeback.groupe.GroupeService;
import com.example.plateformeback.user.Users;
import com.example.plateformeback.user.UsersService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Slf4j
@AllArgsConstructor
@Controller
public class PublicationControlleur {

    private final UsersService usersService;
    private final GroupeService groupeService;
    private final PublicationService publicationService;
    private final SimpMessagingTemplate messagingTemplate;

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

        log.info("✅ publication sauvegardé: ID={}", savedpublication.id());

        messagingTemplate.convertAndSend(
                "/topic/groupe/" + groupeId,
                savedpublication
        );

    } catch (Exception e) {
        log.error("❌ Erreur envoi publication", e);
    }
}
}