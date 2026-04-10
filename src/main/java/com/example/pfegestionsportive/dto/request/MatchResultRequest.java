package com.example.pfegestionsportive.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MatchResultRequest {
    @NotNull @Min(0)
    private Integer scoreDomicile;

    @NotNull @Min(0)
    private Integer scoreExterieur;
}