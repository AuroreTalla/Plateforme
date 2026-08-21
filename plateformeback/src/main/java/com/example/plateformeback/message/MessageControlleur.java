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
    @MessageMapping("/sendMessage/{groupeId}")
public void sendMessage(
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

        Message message = new Message();
        message.setContent(payload.get("content"));
        message.setSender(currentUser);
        message.setGroupe(groupe);

        MessageDTO savedMessage = messageService.sendMessage(message);

        log.info("✅ Message sauvegardé: ID={}", savedMessage.id());

        messagingTemplate.convertAndSend(
                "/topic/groupe/" + groupeId,
                savedMessage
        );

    } catch (Exception e) {
        log.error("❌ Erreur envoi message", e);
    }
}
}