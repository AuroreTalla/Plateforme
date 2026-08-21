package com.example.plateformeback.user.demandeProfesseur;

import jakarta.persistence.*;
import com.example.plateformeback.enums.TypeStatutDemande;
import com.example.plateformeback.user.Users;
import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "demandeProfesseur")
public class DemandeProfesseur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    private TypeStatutDemande statut = TypeStatutDemande.EN_ATTENTE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private Users users;

    @Column(name = "date_validation")
    private LocalDateTime dateValidation;
}