package com.example.plateformeback.reponse;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReponseRepository extends JpaRepository<Reponse, Long> {
    List<Reponse> findByPublicationId(Long publicationId);
}
    