package com.example.plateformeback.consultation;

import com.example.plateformeback.enums.SourceDonnee;
import com.example.plateformeback.enums.TypeRessourceConsulte;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor
@Entity
@Table(name = "consultation")
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "user_id")
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_ressource", nullable = false)
    private TypeRessourceConsulte typeRessource;

    @Column(name = "ressource_id", nullable = false)
    private Long ressourceId;

    @Column(name = "matiere_id")
    private Long matiereId;

    @Column(name = "date_consultation")
    private LocalDateTime dateConsultation;

    @Enumerated(EnumType.STRING)
    @Column(name = "source", nullable = false)
    private SourceDonnee source = SourceDonnee.REEL;

    @PrePersist
    public void prePersist() {
        this.dateConsultation = LocalDateTime.now();
    }
}
