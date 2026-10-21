package com.example.plateformeback.upload;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.nio.file.Path;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

class UploadServiceTest {

    @TempDir Path dossier;
    UploadService service;

    @BeforeEach
    void init() {
        service = new UploadService();
        ReflectionTestUtils.setField(service, "uploadDir", dossier.toString());
    }

    @Test
    void unExecutableRenommeEnPdfEstRefuse() {
        MockMultipartFile faux = new MockMultipartFile(
                "file", "cours.pdf", "application/pdf", "MZ-pas-un-pdf-du-tout".getBytes());

        assertThrows(IllegalArgumentException.class, () -> service.upload(faux, "PDF"));
    }

    @Test
    void unVraiPdfEstAccepte() {
        MockMultipartFile vrai = new MockMultipartFile(
                "file", "cours.pdf", "application/pdf", "%PDF-1.4 contenu".getBytes());

        String url = service.upload(vrai, "PDF");

        assertTrue(url.startsWith("/uploads/"));
    }

    @Test
    void uneExtensionNonAutoriseeEstRefusee() {
        MockMultipartFile exe = new MockMultipartFile(
                "file", "virus.exe", "application/octet-stream", "MZ".getBytes());

        assertThrows(IllegalArgumentException.class, () -> service.upload(exe, "PDF"));
    }
}