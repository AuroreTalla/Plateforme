package com.example.plateformeback.exercice;


public record ExerciceDTO(Long id, String titre, String type, String contenu, String mediaUrl, int ordre, Long matiereId) {
    public static ExerciceDTO fromEntity(Exercice exercice) {
        return new ExerciceDTO(
                exercice.getId(), exercice.getTitre(), exercice.getType().name(),
                exercice.getContenu(), exercice.getMediaUrl(), exercice.getOrdre(),
                exercice.getMatiere().getId()
        );
    }
}
