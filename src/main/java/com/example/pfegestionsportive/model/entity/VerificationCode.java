package com.example.pfegestionsportive.model.entity;

import com.example.pfegestionsportive.model.enums.VerificationStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_codes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String code;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerificationStatus statut = VerificationStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime dateCreation;

    @Column(nullable = false)
    private LocalDateTime dateExpiration;

    // ✅ PrePersist y7aseb el dates wakt el save fel database
    @PrePersist
    public void prePersist() {
        this.dateCreation   = LocalDateTime.now();
        this.dateExpiration = LocalDateTime.now().plusMinutes(10);
    }
}