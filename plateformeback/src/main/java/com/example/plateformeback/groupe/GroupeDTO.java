package com.example.plateformeback.groupe;

import lombok.Builder;

@Builder
public record GroupeDTO(
        Long id,
        String nom,
        String description
) {
    public static GroupeDTO fromEntity(Groupe groupe) {
        return GroupeDTO.builder()
                .id(groupe.getId())
                .nom(groupe.getNom())
                .description(groupe.getDescription())
                .build();
    }
}