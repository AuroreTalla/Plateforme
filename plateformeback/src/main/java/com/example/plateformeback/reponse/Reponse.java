package com.example.plateformeback.reponse;
import com.example.plateformeback.publication.*;
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
@Table(name = "reponse")
public class Reponse {

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
    @JoinColumn(name = "publication_id", nullable = false)
    private Publication publication;

    @Column(name = "date_reponse")
    private LocalDateTime dateReponse;

    @Column(name = "date_validation")
    private LocalDateTime dateValidation;

    @Column(name = "validee_par_user_id")
    private Long valideeParUserId;

    @PrePersist
    public void prePersist() {
        this.dateReponse = LocalDateTime.now();
    }

    @Column(name = "est_solution_proposee", nullable = false)
    private boolean estSolutionProposee;

    @Column(name = "validee_par_admin", nullable = false)
    private boolean valideeParAdmin;

}
