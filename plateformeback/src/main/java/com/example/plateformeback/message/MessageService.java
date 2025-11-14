package com.example.plateformeback.message;

import com.example.plateformeback.groupe.Groupe;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@AllArgsConstructor
@Service
public class MessageService {

    private final MessageRepository messageRepository;

    @Transactional
    public MessageDTO sendMessage(Message message) {
        Message saved = messageRepository.save(message);
        return MessageDTO.fromEntity(saved);
    }

    public List<MessageDTO> getMessagesByGroupeDTO(Groupe groupe) {
        return messageRepository.findByGroupeId(groupe.getId())
                .stream()
                .map(MessageDTO::fromEntity)
                .toList();
    }
}