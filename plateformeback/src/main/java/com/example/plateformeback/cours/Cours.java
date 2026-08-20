package com.example.plateformeback.cours;

import com.example.plateformeback.enums.TypeContenu;
import com.example.plateformeback.matiere.*;
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
@Table(name = "cours")
public class Cours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matiere_id", nullable = false)
    private Matiere matiere;

    @Column(name = "titre", nullable = false)
    private String titre;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TypeContenu type = TypeContenu.TEXTE;

    @Column(name = "contenu", columnDefinition = "TEXT")
    private String contenu;

    @Column(name = "media_url", length = 500)
    private String mediaUrl;

    @Column(name = "ordre", nullable = false)
    private int ordre;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @PrePersist
    public void prePersist() {
        this.dateCreation = LocalDateTime.now();
    }
}