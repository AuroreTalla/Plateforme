package com.example.plateformeback.reponse;

import com.example.plateformeback.enums.TypeStatut;
import com.example.plateformeback.publication.Publication;
import com.example.plateformeback.publication.PublicationRepository;
import com.example.plateformeback.user.Users;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@Service
public class ReponseService {

    private final ReponseRepository reponseRepository;
    private final PublicationRepository publicationRepository;

    @Transactional
    public ReponseDTO sendreponse(Reponse reponse) {
        Reponse saved = reponseRepository.save(reponse);
        return ReponseDTO.fromEntity(saved);
    }

    public List<ReponseDTO> getreponsesByPublicationDTO(Publication publication) {
        return reponseRepository.findByPublicationId(publication.getId())
                .stream()
                .map(ReponseDTO::fromEntity)
                .toList();
    }

    /**
     * L'auteur de la publication propose cette réponse comme solution.
     * Ne fait AUCUNE validation officielle — juste un signal pour l'admin.
     */
    @Transactional
    public ReponseDTO proposerSolution(Long reponseId, Users currentUser) {
        Reponse reponse = reponseRepository.findById(reponseId)
                .orElseThrow(() -> new RuntimeException("Réponse introuvable : " + reponseId));

        Publication publication = reponse.getPublication();

        if (publication.getSender().getId() != currentUser.getId()) {
            throw new SecurityException("Seul l'auteur de la publication peut proposer une solution.");
        }

        reponse.setEstSolutionProposee(true);
        Reponse saved = reponseRepository.save(reponse);
        return ReponseDTO.fromEntity(saved);
    }

    /**
     * L'admin valide officiellement une réponse comme solution.
     * Passe la publication à RESOLUE.
     */
    @Transactional
    public ReponseDTO validerSolution(Long reponseId, Users admin) {

        if (admin.getStatut() != TypeStatut.ADMIN && admin.getStatut() != TypeStatut.PROFESSEUR) {
            throw new SecurityException("Seul un admin ou professeur peut valider une solution.");
        }

        Reponse reponse = reponseRepository.findById(reponseId)
                .orElseThrow(() -> new RuntimeException("Réponse introuvable : " + reponseId));

        reponse.setValideeParAdmin(true);
        reponse.setValideeParUserId(admin.getId());
        reponse.setDateValidation(LocalDateTime.now());
        Reponse saved = reponseRepository.save(reponse);

        Publication publication = reponse.getPublication();
        publication.setStatut("RESOLUE");
        publicationRepository.save(publication);

        return ReponseDTO.fromEntity(saved);
    }

    /**
     * L'admin retire la validation. Si plus aucune réponse validée
     * ne subsiste pour cette publication, elle repasse NON_RESOLUE.
     */
    @Transactional
    public ReponseDTO devaliderSolution(Long reponseId, Users admin) {
        if (admin.getStatut() != TypeStatut.ADMIN && admin.getStatut() != TypeStatut.PROFESSEUR) {
            throw new SecurityException("Seul un admin ou professeur peut dévalider une solution.");
        }

        Reponse reponse = reponseRepository.findById(reponseId)
                .orElseThrow(() -> new RuntimeException("Réponse introuvable : " + reponseId));

        reponse.setValideeParAdmin(false);
        reponse.setValideeParUserId(null);
        reponse.setDateValidation(null);
        Reponse saved = reponseRepository.save(reponse);

        Publication publication = reponse.getPublication();
        boolean autresValidees = reponseRepository
                .findByPublicationId(publication.getId())
                .stream()
                .anyMatch(Reponse::isValideeParAdmin);

        if (!autresValidees) {
            publication.setStatut("NON_RESOLUE");
            publicationRepository.save(publication);
        }

        return ReponseDTO.fromEntity(saved);
    }
}