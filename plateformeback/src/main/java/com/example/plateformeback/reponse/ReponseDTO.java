package com.example.plateformeback.reponse;

import com.example.plateformeback.user.UserDTO;
import java.time.format.DateTimeFormatter;

public record ReponseDTO(
        Long id,
        String content,
        String dateReponse,
        UserDTO user,
        Long publicationId,
        boolean estSolutionProposee,
        boolean valideeParAdmin,
        String dateValidation
) {
    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    public static ReponseDTO fromEntity(Reponse reponse) {
        return new ReponseDTO(
                reponse.getId(),
                reponse.getContent(),
                reponse.getDateReponse().format(FORMATTER),
                UserDTO.fromEntity(reponse.getSender()),
                reponse.getPublication().getId(),
                reponse.isEstSolutionProposee(),
                reponse.isValideeParAdmin(),
                reponse.getDateValidation() != null
                        ? reponse.getDateValidation().format(FORMATTER)
                        : null
        );
    }
}