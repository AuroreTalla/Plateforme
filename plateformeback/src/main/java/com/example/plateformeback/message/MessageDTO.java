package com.example.plateformeback.message;

import com.example.plateformeback.user.UserDTO;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public record MessageDTO(
        Long id,
        String content,
        String dateEnvoie,
        UserDTO user,
        String groupeNom
) {
    public static MessageDTO fromEntity(Message message) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        return new MessageDTO(
                message.getId(),
                message.getContent(),
                message.getDateEnvoie().format(formatter),
                UserDTO.fromEntity(message.getSender()),
                message.getGroupe().getNom()
        );
    }
}
