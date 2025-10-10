package com.example.plateformeback.message;

import com.example.plateformeback.user.UserDTO;

import java.time.LocalDateTime;

public record MessageDTO(
        Long id,
        String content,
        String dateEnvoie,
        UserDTO user,
        String groupeNom
) {
    public static MessageDTO fromEntity(Message message) {
        return new MessageDTO(
                message.getId(),
                message.getContent(),
                message.getDateEnvoie().toString(),
                UserDTO.fromEntity(message.getSender()),
                message.getGroupe().getNom()
        );
    }
}
