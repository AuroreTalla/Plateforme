package com.example.plateformeback.publication;

import com.example.plateformeback.groupe.Groupe;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    public PageResponse<PublicationDTO> searchPublications(Long groupeId, String keyword, int page, int size) {
        String kw = (keyword == null || keyword.isBlank()) ? null : keyword.trim();
        Pageable pageable = PageRequest.of(page, size);

        Page<Publication> result = publicationRepository.searchByGroupe(groupeId, kw, pageable);

        return new PageResponse<>(
                result.getContent().stream().map(PublicationDTO::fromEntity).toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    public Publication findById(Long id) {
        return publicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publication introuvable : " + id));
    }

    public long compterNonResoluesParGroupe(Long groupeId) {
    return publicationRepository.countByGroupeIdAndStatut(groupeId, "NON_RESOLUE");
}
}