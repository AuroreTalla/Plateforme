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

import java.security.Principal;
import java.util.Map;

@Slf4j
@AllArgsConstructor
@Controller
public class MessageControlleur {

    private final UsersService usersService;
    private final GroupeService groupeService;
    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/sendMessage/{nom}")
    public void sendMessage(@Payload Message message,
                            @DestinationVariable String nom,
                            Principal principal) {
        try {
            Groupe groupe = groupeService.findByNom(nom);
            Users sender = usersService.getUserByEmail(principal.getName());

            groupeService.checkUserMember(groupe, sender);

            message.setGroupe(groupe);
            message.setSender(sender);

            MessageDTO messageDTO = messageService.sendMessage(message);

            messagingTemplate.convertAndSend("/topic/groupe/" + nom, messageDTO);

        } catch (Exception e) {
            log.error("Erreur envoi message: {}", e.getMessage());
            messagingTemplate.convertAndSendToUser(
                    principal.getName(),
                    "/queue/errors",
                    Map.of("error", e.getMessage())
            );
        }
    }
}