package com.example.plateformeback.upload;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class UploadService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    // Extensions autorisées par catégorie, avec taille max en octets
    private static final Map<String, Long> IMAGE_EXT = Map.of("jpg", 2_000_000L, "jpeg", 2_000_000L, "png", 2_000_000L, "webp", 2_000_000L);
    private static final Map<String, Long> VIDEO_EXT = Map.of("mp4", 15_000_000L);
    private static final Map<String, Long> AUDIO_EXT = Map.of("mp3", 8_000_000L, "wav", 8_000_000L);
    private static final Map<String, Long> PDF_EXT = Map.of("pdf", 5_000_000L);
    private static final Map<String, Long> DOC_EXT = Map.of("doc", 5_000_000L, "docx", 5_000_000L, "txt", 1_000_000L);

    public String upload(MultipartFile file, String categorie) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Fichier vide.");
        }

        String nomOriginal = file.getOriginalFilename();
        if (nomOriginal == null || !nomOriginal.contains(".")) {
            throw new IllegalArgumentException("Nom de fichier invalide.");
        }

        String extension = nomOriginal.substring(nomOriginal.lastIndexOf('.') + 1).toLowerCase();
        Map<String, Long> extensionsAutorisees = getExtensionsPourCategorie(categorie);

        if (!extensionsAutorisees.containsKey(extension)) {
            throw new IllegalArgumentException(
                "Extension ." + extension + " non autorisée pour le type " + categorie +
                ". Extensions acceptées : " + extensionsAutorisees.keySet()
            );
        }

        long tailleMax = extensionsAutorisees.get(extension);
        if (file.getSize() > tailleMax) {
            throw new IllegalArgumentException(
                "Fichier trop volumineux (" + (file.getSize() / 1_000_000) + " Mo). " +
                "Maximum autorisé : " + (tailleMax / 1_000_000) + " Mo."
            );
        }

        try {
            Path dossier = Paths.get(uploadDir);
            if (!Files.exists(dossier)) {
                Files.createDirectories(dossier);
            }

            String nomFichier = UUID.randomUUID() + "." + extension;
            Path destination = dossier.resolve(nomFichier);
            file.transferTo(destination);

            return "/uploads/" + nomFichier;

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l'enregistrement du fichier.", e);
        }
    }

    private Map<String, Long> getExtensionsPourCategorie(String categorie) {
        return switch (categorie.toUpperCase()) {
            case "IMAGE" -> IMAGE_EXT;
            case "VIDEO" -> VIDEO_EXT;
            case "AUDIO" -> AUDIO_EXT;
            case "PDF" -> PDF_EXT;
            case "DOCUMENT" -> DOC_EXT;
            default -> throw new IllegalArgumentException("Catégorie inconnue : " + categorie);
        };
    }
}