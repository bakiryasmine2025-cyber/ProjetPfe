package com.example.pfegestionsportive.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendMessageRequest {

    @NotBlank
    private String receiverId;

    @NotBlank
    private String sujet;

    @NotBlank
    private String contenu;
}