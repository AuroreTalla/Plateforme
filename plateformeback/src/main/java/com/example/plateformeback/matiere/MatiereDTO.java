package com.example.plateformeback.matiere;

public record MatiereDTO(
        Long id,
        String nom,
        String description,
        Long groupeId,
        long nbCours,
        long nbExercices
) {
    public static MatiereDTO fromEntity(Matiere matiere, long nbCours, long nbExercices) {
        return new MatiereDTO(
                matiere.getId(),
                matiere.getNom(),
                matiere.getDescription(),
                matiere.getGroupe().getId(),
                nbCours,
                nbExercices
        );
    }
}
