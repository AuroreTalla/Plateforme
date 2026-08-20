package com.example.plateformeback.matiere;

import com.example.plateformeback.groupe.Groupe;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "matiere")
public class Matiere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "nom", nullable = false, unique = true)
    private String nom;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "groupe_id", nullable = false, unique = true)
    private Groupe groupe;
}