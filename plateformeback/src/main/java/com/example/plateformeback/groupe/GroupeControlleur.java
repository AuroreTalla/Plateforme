package com.example.plateformeback.groupe;

import com.example.plateformeback.message.Message;
import com.example.plateformeback.message.MessageDTO;
import com.example.plateformeback.user.Users;
import com.example.plateformeback.user.UsersService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
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
    @PostMapping("/{nom}/join")
    public GroupeDTO joinGroupe(@PathVariable String nom) {
        Users currentUser = usersService.getCurrentUser();
        Groupe groupe = groupeService.joinGroupe(nom, currentUser);
        return GroupeDTO.fromEntity(groupe);
    }


    // Récupérer les messages d'un groupe avec pagination
    @GetMapping("/{nom}/messages")
    public List<MessageDTO> getMessages(
            @PathVariable String nom,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("dateEnvoie").ascending());
        return groupeService.getMessagesDTO(nom, pageable); // déjà des DTO
    }

    // Récupérer tous les groupes
    @GetMapping
    public List<GroupeDTO> getAllGroupes() {
        Users currentUser = usersService.getCurrentUser();
        return groupeService.getAllGroupesDTO(currentUser);
    }


    // Récupérer tous les messages
    @GetMapping("/{nom}/messages/last")
    public MessageDTO getLastMessage(@PathVariable String nom) {
        return groupeService.getLastMessageDTO(nom);
    }
}
