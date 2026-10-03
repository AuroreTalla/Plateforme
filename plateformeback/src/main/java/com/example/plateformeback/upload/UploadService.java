package com.example.plateformeback.upload;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@Service
public class UploadService {

    @Value("${app.upload.dir}")
    private String uploadDir;

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

        verifierSignatureBinaire(file, extension);

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

    /**
     * Vérifie que le contenu réel du fichier correspond à l'extension déclarée,
     * en inspectant sa signature binaire (magic bytes).
     */
    private void verifierSignatureBinaire(MultipartFile file, String extension) {
        byte[] entete = new byte[12];
        try (InputStream is = file.getInputStream()) {
            int lus = is.read(entete);
            if (lus < 4) {
                throw new IllegalArgumentException("Fichier trop court ou corrompu.");
            }
        } catch (IOException e) {
            throw new RuntimeException("Impossible de lire le fichier pour vérification.", e);
        }

        boolean valide = switch (extension) {
            case "jpg", "jpeg" -> matchSignature(entete, 0xFF, 0xD8, 0xFF);
            case "png" -> matchSignature(entete, 0x89, 0x50, 0x4E, 0x47);
            case "webp" -> matchSignature(entete, 0x52, 0x49, 0x46, 0x46); // "RIFF"
            case "pdf" -> matchSignature(entete, 0x25, 0x50, 0x44, 0x46); // "%PDF"
            case "mp4" -> matchMp4(entete);
            case "mp3" -> matchSignature(entete, 0x49, 0x44, 0x33) || matchSignature(entete, 0xFF, 0xFB);
            case "wav" -> matchSignature(entete, 0x52, 0x49, 0x46, 0x46); // "RIFF"
            case "docx" -> matchSignature(entete, 0x50, 0x4B, 0x03, 0x04); // zip (docx = zip)
            case "doc" -> matchSignature(entete, 0xD0, 0xCF, 0x11, 0xE0); // format OLE
            case "txt" -> true; // texte brut, pas de signature fiable à vérifier
            default -> false;
        };

        if (!valide) {
            throw new IllegalArgumentException(
                "Le contenu du fichier ne correspond pas à son extension déclarée (." + extension + ")."
            );
        }
    }

    private boolean matchSignature(byte[] entete, int... attendus) {
        if (entete.length < attendus.length) return false;
        for (int i = 0; i < attendus.length; i++) {
            if ((entete[i] & 0xFF) != attendus[i]) return false;
        }
        return true;
    }

    private boolean matchMp4(byte[] entete) {
        // MP4 : les octets 4-7 contiennent généralement "ftyp"
        return entete.length >= 8
                && entete[4] == 0x66 && entete[5] == 0x74 && entete[6] == 0x79 && entete[7] == 0x70;
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