package com.example.plateformeback.publication;
import com.example.plateformeback.groupe.Groupe;
import com.example.plateformeback.user.Users;
import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name = "publication")
public class Publication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "titre", nullable = false, columnDefinition = "TEXT")
    private String titre;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private Users sender;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "groupe_id", nullable = false)
    private Groupe groupe;

    @Column(name = "date_publication")
    private LocalDateTime datePublication;

     @Column(name = "statut", nullable = false)
    private String statut;

    @PrePersist
    public void prePersist() {
    this.datePublication = LocalDateTime.now();
    if (this.statut == null) {
        this.statut = "NON_RESOLUE";
    }
}

}
