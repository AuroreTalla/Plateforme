package com.example.plateformeback.user.demandeProfesseur;

import com.example.plateformeback.user.UserDTO;
import java.time.format.DateTimeFormatter;

public record DemandeProfesseurDTO(
        Long id,
        String statut,
        UserDTO user,
        String dateValidation
) {
    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    public static DemandeProfesseurDTO fromEntity(DemandeProfesseur demande) {
        return new DemandeProfesseurDTO(
                demande.getId(),
                demande.getStatut().name(),
                UserDTO.fromEntity(demande.getUsers()),
                demande.getDateValidation() != null
                        ? demande.getDateValidation().format(FORMATTER)
                        : null
        );
    }
}