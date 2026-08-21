package com.example.plateformeback.message;

import com.example.plateformeback.user.UserDTO;
import java.time.format.DateTimeFormatter;

public record MessageDTO(
        Long id,
        String content,
        String dateEnvoie,
        UserDTO user,
        Long groupeId
) {
    public static MessageDTO fromEntity(Message message) {

<<<<<<< HEAD
        // ✅ Utiliser ISO format pour que JavaScript puisse parser correctement
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        return new MessageDTO(
                message.getId(),
                message.getContent(),
                message.getDateEnvoie().format(formatter),
                UserDTO.fromEntity(message.getSender()),
                message.getGroupe().getNom()
        );
    }
=======
    DateTimeFormatter formatter =
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    return new MessageDTO(
            message.getId(),
            message.getContent(),
            message.getDateEnvoie().format(formatter),
            UserDTO.fromEntity(message.getSender()),
            message.getGroupe().getId()
    );
}
>>>>>>> origin/main
}
