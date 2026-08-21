package com.example.plateformeback.groupe;

import com.example.plateformeback.user.Users;
import lombok.Builder;

import java.util.List;

@Builder
public record GroupeDTO(
        Long id,
        String nom,
        String description,
        int nombreMembres,
        List<String> membres,
        boolean joined
) {
    // Version avec currentUser (pour afficher joined)
    public static GroupeDTO fromEntity(Groupe groupe, Users currentUser) {
        List<String> membres = groupe.getMembres().stream()
                .map(Users::getName)
                .toList();

        boolean joined = groupe.getMembres().contains(currentUser);

        return GroupeDTO.builder()
                .id(groupe.getId())
                .nom(groupe.getNom())
                .description(groupe.getDescription())
                .nombreMembres(membres.size())
                .membres(membres)
                .joined(joined)
                .build();
    }

    // Version sans currentUser (utile dans certains services)
    public static GroupeDTO fromEntity(Groupe groupe) {
        List<String> membres = groupe.getMembres().stream()
                .map(Users::getName)
                .toList();

        return GroupeDTO.builder()
                .id(groupe.getId())
                .nom(groupe.getNom())
                .description(groupe.getDescription())
                .nombreMembres(membres.size())
                .membres(membres)
                .joined(false)
                .build();
    }
}


