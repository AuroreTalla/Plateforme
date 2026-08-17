package com.example.plateformeback.publication;

import com.example.plateformeback.groupe.Groupe;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@AllArgsConstructor
@Service
public class PublicationService {

    private final PublicationRepository publicationRepository;

    @Transactional
    public PublicationDTO sendpublication(Publication publication) {
        Publication saved = publicationRepository.save(publication);
        return PublicationDTO.fromEntity(saved);
    }

    public List<PublicationDTO> getpublicationsByGroupeDTO(Groupe groupe) {
        return publicationRepository.findByGroupeId(groupe.getId())
                .stream()
                .map(PublicationDTO::fromEntity)
                .toList();
    }

    // dans PublicationService.java
    public Publication findById(Long id) {
        return publicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publication introuvable : " + id));
    }
}