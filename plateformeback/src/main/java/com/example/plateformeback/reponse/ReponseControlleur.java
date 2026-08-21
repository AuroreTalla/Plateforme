package com.example.plateformeback.reponse;

import com.example.plateformeback.publication.Publication;
import com.example.plateformeback.publication.PublicationService;
import com.example.plateformeback.user.Users;
import com.example.plateformeback.user.UsersService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Map;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/reponses")
public class ReponseControlleur {

    private final ReponseService reponseService;
    private final UsersService usersService;
    private final PublicationService publicationService;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/publication/{publicationId}")
    public List<ReponseDTO> getReponsesByPublication(@PathVariable Long publicationId) {
        Publication publication = publicationService.findById(publicationId);
        return reponseService.getreponsesByPublicationDTO(publication);
    }

    @Transactional
    @MessageMapping("/sendreponse/{publicationId}")
    public void sendreponse(
            @DestinationVariable Long publicationId,
            @Payload Map<String, String> payload
    ) {
        try {
            String userEmail = payload.get("userEmail");

            if (userEmail == null || userEmail.isEmpty()) {
                log.error("❌ Email utilisateur manquant");
                return;
            }

            Users currentUser = usersService.getUserByEmail(userEmail);
            Publication publication = publicationService.findById(publicationId);

            Reponse reponse = new Reponse();
            reponse.setContent(payload.get("content"));
            reponse.setSender(currentUser);
            reponse.setPublication(publication);

            ReponseDTO savedreponse = reponseService.sendreponse(reponse);

            log.info("✅ reponse sauvegardée: ID={}", savedreponse.id());

            messagingTemplate.convertAndSend(
                    "/topic/publication/" + publicationId,
                    savedreponse
            );

        } catch (Exception e) {
            log.error("❌ Erreur envoi reponse", e);
        }
    }

    @PatchMapping("/{id}/proposer-solution")
    public ReponseDTO proposerSolution(@PathVariable Long id, Authentication auth) {
        Users currentUser = (Users) auth.getPrincipal();
        ReponseDTO dto = reponseService.proposerSolution(id, currentUser);

        messagingTemplate.convertAndSend(
                "/topic/publication/" + dto.publicationId(),
                dto
        );

        return dto;
    }

    @PatchMapping("/{id}/valider")
    public ReponseDTO validerSolution(@PathVariable Long id, Authentication auth) {
        Users admin = (Users) auth.getPrincipal();
        ReponseDTO dto = reponseService.validerSolution(id, admin);

        messagingTemplate.convertAndSend(
                "/topic/publication/" + dto.publicationId(),
                dto
        );

        return dto;
    }

    @PatchMapping("/{id}/devalider")
    public ReponseDTO devaliderSolution(@PathVariable Long id, Authentication auth) {
        Users admin = (Users) auth.getPrincipal();
        ReponseDTO dto = reponseService.devaliderSolution(id, admin);

        messagingTemplate.convertAndSend(
                "/topic/publication/" + dto.publicationId(),
                dto
        );

        return dto;
    }
}