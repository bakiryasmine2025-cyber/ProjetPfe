package com.example.pfegestionsportive.model.entity;

import com.example.pfegestionsportive.model.enums.AccountStatus;
import com.example.pfegestionsportive.model.enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String motDePasseHash;

    private String nom;
    private String telephone;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AccountStatus statut = AccountStatus.ACTIVE;

    private LocalDateTime derniereConnexion;

    @Builder.Default
    private LocalDateTime dateCreation = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "club_id")
    @JsonIgnoreProperties({"adminUser", "clubsSuivis", "hibernateLazyInitializer"})

    private Club club;

    @Column(name = "date_inscription", updatable = false)
    @CreationTimestamp
    private LocalDateTime dateInscription;

    @ManyToMany
    @JoinTable(
            name = "user_clubs_suivis",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "club_id")
    )
    @JsonIgnoreProperties({"adminUser", "clubsSuivis", "hibernateLazyInitializer"})
    @Builder.Default
    private List<Club> clubsSuivis = new ArrayList<>(); // For FAN
}
