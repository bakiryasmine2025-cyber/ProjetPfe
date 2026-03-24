package com.example.pfegestionsportive.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(nullable = false)
    private String sujet;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenu;

    @Builder.Default
    private boolean lu = false;

    @Builder.Default
    private LocalDateTime dateEnvoi = LocalDateTime.now();
}
