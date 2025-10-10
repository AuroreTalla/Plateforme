package com.example.plateformeback.message;

import com.example.plateformeback.groupe.Groupe;
import com.example.plateformeback.groupe.GroupeService;
import com.example.plateformeback.user.Users;
import com.example.plateformeback.user.UsersService;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Controller
public class MessageControlleur {

    private final UsersService usersService;
    private final GroupeService groupeService;
    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/message")
    @SendTo("/topic/public")
    public MessageDTO receiveMessage(@Payload Message message) {
        return MessageDTO.fromEntity(message);
    }

    //envoie de message
    @MessageMapping("/sendMessage/{nom}")
    public void sendMessage(@Payload Message message,
                            @DestinationVariable String nom,
                            Principal principal) {

        // Récupération du groupe et de l'utilisateur
        Groupe groupe = groupeService.findByNom(nom);
        Users sender = usersService.getUserByEmail(principal.getName());

        // Vérification membre avant persistance
        groupeService.checkUserMember(groupe, sender);

        // Définir les infos
        message.setGroupe(groupe);
        message.setSender(sender);

        // Persister et récupérer DTO
        MessageDTO messageDTO = messageService.sendMessage(message);

        // Diffuser le DTO
        messagingTemplate.convertAndSend("/topic/groupe/" + nom, messageDTO);
    }

}