package com.example.pfegestionsportive.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class FeedResponse {
    private List<ActualiteResponse> actualites;
    private List<MatchResponse> derniersResultats;
}
