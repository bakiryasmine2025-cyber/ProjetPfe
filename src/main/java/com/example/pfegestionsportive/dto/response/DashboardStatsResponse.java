package com.example.pfegestionsportive.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse {
    private long nombreJoueurs;
    private long nombreEquipes;
    private long nombreStaff;
    private long nombrePartenaires;
    private String nomClub;
}
