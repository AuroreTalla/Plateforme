package com.example.plateformeback.message;

import com.example.plateformeback.groupe.Groupe;
import com.example.plateformeback.groupe.GroupeService;
import com.example.plateformeback.user.Users;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final GroupeService groupeService;

    public MessageDTO sendMessage(Message message) {
        // Vérifie que le user est membre
        Groupe groupe = message.getGroupe();
        Users user = message.getSender();
        if (!groupe.getMembres().contains(user)) {
            throw new RuntimeException("Vous devez rejoindre ce groupe avant d'envoyer un message.");
        }

        message.setDateEnvoie(LocalDateTime.now());
        Message saved = messageRepository.save(message);
        return MessageDTO.fromEntity(saved);
    }


    // Récupérer les messages d'un groupe et retourner en DTO
    public List<MessageDTO> getMessagesByGroupeDTO(Groupe groupe) {
        return messageRepository.findByGroupeId(groupe.getId())
                .stream()
                .map(MessageDTO::fromEntity)
                .collect(Collectors.toList());
    }}
