package com.example.plateformeback.recommendation;

public record RecommandationDTO(String type, Long id, String titre, String raison,
                                Long matiereId, Long groupeId) {}