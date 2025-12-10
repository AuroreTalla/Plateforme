package com.example.plateformeback.message;

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
public class MessageControlleur {

    private final UsersService usersService;
    private final GroupeService groupeService;
    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    @MessageMapping("/sendMessage/{groupeNom}")
    public void sendMessage(
            @DestinationVariable String groupeNom,
            @Payload Map<String, String> payload
    ) {
        try {
            log.info("📩 Message reçu pour le groupe: {}", groupeNom);
            log.info("📦 Payload complet: {}", payload);

            // ✅ CORRECTION : chercher "userEmail" au lieu de "email"
            String userEmail = payload.get("userEmail");

            if (userEmail == null || userEmail.isEmpty()) {
                log.error("❌ Email utilisateur manquant. Payload: {}", payload);
                return;
            }

            log.info("👤 Utilisateur: {}", userEmail);

            // Récupérer l'utilisateur par email
            Users currentUser = usersService.getUserByEmail(userEmail);

            // Récupérer le groupe
            Groupe groupe = groupeService.findByNom(groupeNom);

            // Vérifier que l'utilisateur est membre
            groupeService.checkUserMember(groupe, currentUser);

            // Créer et sauvegarder le message
            Message message = new Message();
            message.setContent(payload.get("content"));
            message.setSender(currentUser);
            message.setGroupe(groupe);

            MessageDTO savedMessage = messageService.sendMessage(message);
            log.info("✅ Message sauvegardé: ID={}", savedMessage.id());

            // Diffuser à tous les abonnés du groupe
            messagingTemplate.convertAndSend(
                    "/topic/groupe/" + groupeNom,
                    savedMessage
            );

            log.info("📡 Message diffusé via WebSocket");

        } catch (Exception e) {
            log.error("❌ Erreur envoi message: {}", e.getMessage(), e);
        }
    }
}