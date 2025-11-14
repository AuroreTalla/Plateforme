package com.example.plateformeback.groupe;

import com.example.plateformeback.message.Message;
import com.example.plateformeback.message.MessageDTO;
import com.example.plateformeback.message.MessageRepository;
import com.example.plateformeback.user.Users;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@AllArgsConstructor
@Service
public class GroupeService {

    private final GroupeRepository groupeRepository;
    private final MessageRepository messageRepository;

    public Groupe creerGroupe(Groupe groupe) {
        return groupeRepository.save(groupe);
    }

    @Transactional
    public Groupe joinGroupe(String nom, Users user) {
        Groupe groupe = groupeRepository.findByNom(nom)
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé"));

        if (!groupe.getMembres().contains(user)) {
            groupe.getMembres().add(user);
            groupeRepository.save(groupe);
        }

        return groupe;
    }

    public List<GroupeDTO> getAllGroupesDTO(Users currentUser) {
        List<Groupe> groupes = groupeRepository.findAll();
        return groupes.stream()
                .map(g -> GroupeDTO.fromEntity(g, currentUser))
                .toList();
    }

    public GroupeDTO findByNomDTO(String nom, Users currentUser) {
        return groupeRepository.findByNom(nom)
                .map(g -> GroupeDTO.fromEntity(g, currentUser))
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé"));
    }

    public List<MessageDTO> getMessagesDTO(String nom, Pageable pageable) {
        return groupeRepository.findMessagesByGroupeNom(nom, pageable).stream()
                .map(MessageDTO::fromEntity)
                .toList();
    }

    public MessageDTO getLastMessageDTO(String nom) {
        Groupe groupe = groupeRepository.findByNom(nom)
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé"));

        Message last = messageRepository.findTop1ByGroupeOrderByDateEnvoieDesc(groupe);

        if (last == null) {
            return null;
        }

        return MessageDTO.fromEntity(last);
    }

    public Groupe findByNom(String nom) {
        return groupeRepository.findByNom(nom)
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé"));
    }

    public void checkUserMember(Groupe groupe, Users user) {
        if (!groupe.getMembres().contains(user)) {
            throw new IllegalArgumentException("L'utilisateur n'est pas membre du groupe");
        }
    }
}