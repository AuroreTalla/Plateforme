package com.example.plateformeback.user;

import com.example.plateformeback.enums.TypeStatut;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
public record UserDTO(
        Long id,
        String name,
        String email,
        TypeStatut statut,
        boolean demandeProfesseur,
        LocalDateTime dateInscription,
        boolean emailVerifie,
        LocalDateTime lastSeen
) {
    public static UserDTO fromEntity(Users user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .statut(user.getStatut())
                .demandeProfesseur(user.isDemandeProfesseur())
                .dateInscription(user.getDateInscription())
                .emailVerifie(user.isEmailVerifie())
                .lastSeen(user.getLastSeen())
                .build();
    }
}
