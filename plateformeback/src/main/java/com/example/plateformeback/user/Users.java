package com.example.plateformeback.user;

import com.example.plateformeback.enums.TypeRoleUser;
import com.example.plateformeback.groupe.Groupe;
import com.example.plateformeback.message.Message;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;
import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class Users implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;


    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    private TypeRoleUser statut;

    @Column(name = "date_inscription")
    private LocalDateTime dateInscription;

    @Column(name = "email_verifie")
    private boolean emailVerifie;

    private LocalDateTime lastSeen;

    @OneToMany(mappedBy = "sender", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Message> sentMessages = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.dateInscription = LocalDateTime.now();
        this.lastSeen = LocalDateTime.now();
    }

    @ManyToMany
    @JoinTable(
            name = "groupe_users",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "groupe_id")
    )
    private List<Groupe> groupes = new ArrayList<>();

    // ---------- Implémentation UserDetails ----------
    @Override
    public boolean isAccountNonExpired() {
        return true;     }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.emailVerifie;
    }

    @Override
    public String getUsername() {
        return this.email; // obligatoire si email = identifiant
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + this.statut));
    }

}
