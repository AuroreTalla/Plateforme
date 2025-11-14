package com.example.plateformeback.groupe;

import com.example.plateformeback.message.Message;
import com.example.plateformeback.user.Users;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "groupe")
public class Groupe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "nom", unique = true)
    private String nom;

    private String description;

    @OneToMany(mappedBy = "groupe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Message> messages = new ArrayList<>();

    @ManyToMany(mappedBy = "groupes")
    private List<Users> membres = new ArrayList<>();
}
