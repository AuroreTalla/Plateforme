package com.example.plateformeback.matiere;

public record MatiereDTO(Long id, String nom, String description, Long groupeId) {
    public static MatiereDTO fromEntity(Matiere matiere) {
        return new MatiereDTO(
                matiere.getId(),
                matiere.getNom(),
                matiere.getDescription(),
                matiere.getGroupe().getId()
        );
    }
}
