package com.example.pfegestionsportive.dto.request;

import com.example.pfegestionsportive.model.enums.AccountStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChangeAccountStatusRequest {

    @NotNull
    private AccountStatus statut;

    private String message;
}
