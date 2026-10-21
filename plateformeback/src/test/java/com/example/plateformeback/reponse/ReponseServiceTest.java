package com.example.plateformeback.reponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.example.plateformeback.enums.TypeRoleUser;
import com.example.plateformeback.groupe.Groupe;
import com.example.plateformeback.publication.PublicationRepository;
import com.example.plateformeback.publication.Publication;
import com.example.plateformeback.user.Users;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ReponseServiceTest {

    @Mock ReponseRepository reponseRepository;
    @Mock PublicationRepository publicationRepository;
    @InjectMocks ReponseService service;

    private Users user(long id, TypeRoleUser statut) {
        Users u = new Users();
        u.setId(id);
        u.setStatut(statut);
        return u;
    }

    private Reponse reponse(long id, Publication p, boolean validee) {
        Reponse r = new Reponse();
        r.setId(id);
        r.setPublication(p);
        r.setSender(user(9, TypeRoleUser.ELEVE));
        r.setDateReponse(LocalDateTime.now());
        if (validee) r.setValideeParUserId(1L);
        return r;
    }

    @Test
    void unEleveNePeutPasValider() {
        Users eleve = user(2, TypeRoleUser.ELEVE);
        assertThrows(SecurityException.class, () -> service.validerSolution(1L, eleve));
        verifyNoInteractions(reponseRepository);
    }

    @Test
    void validerPasseLaPublicationEnResolue() {
        Publication p = new Publication();
        p.setStatut("NON_RESOLUE");
        p.setGroupe(new Groupe());
        p.setSender(user(5, TypeRoleUser.ELEVE));
        p.setDatePublication(LocalDateTime.now());
        Reponse r = reponse(1, p, false);

        when(reponseRepository.findById(1L)).thenReturn(Optional.of(r));
        when(reponseRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        service.validerSolution(1L, user(1, TypeRoleUser.ADMIN));

        assertEquals("RESOLUE", p.getStatut());
        assertEquals(1L, r.getValideeParUserId());
    }

    @Test
    void devaliderGardeRESOLUESiUneAutreSolutionExiste() {
        Publication p = new Publication();
        p.setStatut("RESOLUE");
        p.setGroupe(new Groupe());
        p.setSender(user(5, TypeRoleUser.ELEVE));
        p.setDatePublication(LocalDateTime.now());
        Reponse r1 = reponse(1, p, true);
        Reponse r2 = reponse(2, p, true);

        when(reponseRepository.findById(1L)).thenReturn(Optional.of(r1));
        when(reponseRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(reponseRepository.findByPublicationId(anyLong())).thenReturn(List.of(r1, r2));

        service.devaliderSolution(1L, user(1, TypeRoleUser.ADMIN));

        assertEquals("RESOLUE", p.getStatut()); // r2 est encore validée
    }

    @Test
    void devaliderLaDerniereSolutionRepasseNonResolue() {
        Publication p = new Publication();
        p.setStatut("RESOLUE");
        p.setGroupe(new Groupe());
        p.setSender(user(5, TypeRoleUser.ELEVE));
        p.setDatePublication(LocalDateTime.now());
        Reponse r1 = reponse(1, p, true);

        when(reponseRepository.findById(1L)).thenReturn(Optional.of(r1));
        when(reponseRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(reponseRepository.findByPublicationId(anyLong())).thenReturn(List.of(r1));

        service.devaliderSolution(1L, user(1, TypeRoleUser.ADMIN));

        assertEquals("NON_RESOLUE", p.getStatut());
    }
}