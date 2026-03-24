package com.example.pfegestionsportive.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class MessageResponse {
    private String id;
    private String senderNom;
    private String receiverNom;
    private String receiverEmail;
    private String sujet;
    private String contenu;
    private boolean lu;
    private LocalDateTime dateEnvoi;
}
