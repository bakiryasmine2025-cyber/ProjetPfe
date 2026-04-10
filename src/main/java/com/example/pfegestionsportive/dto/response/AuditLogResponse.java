package com.example.pfegestionsportive.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AuditLogResponse {
    private String id;
    private String entite;
    private String action;
    private String utilisateurEmail;
    private String details;
    private LocalDateTime date;
}