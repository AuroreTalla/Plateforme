package com.example.plateformeback.groupe;
import com.example.plateformeback.user.Users;
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
        private Long id;

        private String nom;
        private String description;

        // ✅ IMPORTANT : cascade ALL pour persister la relation
        @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
        @JoinTable(
                name = "groupe_users",
                joinColumns = @JoinColumn(name = "groupe_id"),
                inverseJoinColumns = @JoinColumn(name = "user_id")
        )
        private List<Users> membres = new ArrayList<>();


}