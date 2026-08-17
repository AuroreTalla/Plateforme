package com.example.plateformeback.message;
//import com.example.plateformeback.enums.MessageType;
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
@Table(name = "message")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private Users sender;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "groupe_id", nullable = false)
    private Groupe groupe;

    @Column(name = "date_envoie")
    private LocalDateTime dateEnvoie;

    @PrePersist
    public void prePersist() {
        this.dateEnvoie = LocalDateTime.now();
    }




    /*@Enumerated(EnumType.STRING)
    private MessageType type;*/

}
