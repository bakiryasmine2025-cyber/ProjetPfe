package com.example.pfegestionsportive.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder
public class TicketResponse {
    private String id;
    private String matchInfo;
    private String matchNom;
    private String matchDate;
    private String stade;
    private String categorie;
    private BigDecimal prix;
    private String statut;
    private String codeTicket;
    private LocalDateTime dateAchat;
    private String qrCodeImage;
}
