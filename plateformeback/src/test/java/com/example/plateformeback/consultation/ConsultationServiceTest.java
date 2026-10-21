package com.example.plateformeback.consultation;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.plateformeback.cours.CoursRepository;
import com.example.plateformeback.enums.TypeRessourceConsulte;
import com.example.plateformeback.exercice.ExerciceRepository;
import com.example.plateformeback.matiere.MatiereRepository;
import com.example.plateformeback.publication.PublicationRepository;
import com.example.plateformeback.user.Users;

import jakarta.persistence.EntityNotFoundException;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ConsultationServiceTest {

    @Mock ConsultationRepository consultationRepository;
    @Mock CoursRepository coursRepository;
    @Mock ExerciceRepository exerciceRepository;
    @Mock PublicationRepository publicationRepository;
    @Mock MatiereRepository matiereRepository;
    @InjectMocks ConsultationService service;

    @Test
    void uneConsultationRecenteNEstPasRecomptee() {
        Users u = new Users();
        u.setId(1L);
        when(consultationRepository
                .existsByUserIdAndTypeRessourceAndRessourceIdAndDateConsultationAfter(
                        eq(1L), eq(TypeRessourceConsulte.COURS), eq(6L), any()))
                .thenReturn(true);

        service.enregistrer(u, TypeRessourceConsulte.COURS, 6L);

        verify(consultationRepository, never()).save(any());
    }

    @Test
    void uneRessourceInexistanteEstRefusee() {
        Users u = new Users();
        u.setId(1L);
        when(consultationRepository
                .existsByUserIdAndTypeRessourceAndRessourceIdAndDateConsultationAfter(
                        any(), any(), any(), any()))
                .thenReturn(false);
        when(coursRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
                () -> service.enregistrer(u, TypeRessourceConsulte.COURS, 99L));
        verify(consultationRepository, never()).save(any());
    }
}