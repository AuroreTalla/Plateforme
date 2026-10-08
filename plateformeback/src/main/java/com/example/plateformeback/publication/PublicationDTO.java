package com.example.plateformeback.publication;

import com.example.plateformeback.user.UserDTO;
import java.time.format.DateTimeFormatter;

public record PublicationDTO(
        Long id,
        String titre,
        String content,
        String datePublication,
        UserDTO user,
        Long groupeId,
        String statut
) {
    public static PublicationDTO fromEntity(Publication publication) {

        UserDTO user = publication.getSender() != null
            ? UserDTO.fromEntity(publication.getSender())
            : null;
            
        return new PublicationDTO(
                publication.getId(),
                publication.getTitre(),
                publication.getContent(),
                publication.getDatePublication().format(FORMATTER),
                user,
                publication.getGroupe().getId(),
                publication.getStatut()
        );
    }

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

}
