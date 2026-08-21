package com.example.plateformeback.cours;


public record CoursDTO(Long id, String titre, String type, String contenu, String mediaUrl, int ordre, Long matiereId) {
    public static CoursDTO fromEntity(Cours cours) {
        return new CoursDTO(
                cours.getId(), cours.getTitre(), cours.getType().name(),
                cours.getContenu(), cours.getMediaUrl(), cours.getOrdre(),
                cours.getMatiere().getId()
        );
    }
}