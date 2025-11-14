package com.example.plateformeback.message;

import com.example.plateformeback.groupe.Groupe;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findAllByOrderByDateEnvoieAsc();

    List<Message> findTop50ByOrderByDateEnvoieDesc();

    List<Message> findByGroupeOrderByDateEnvoieAsc(Groupe groupe);

    List<Message> findByGroupeId(Long groupeId);

    Message findTop1ByGroupeOrderByDateEnvoieDesc(Groupe groupe);
}
