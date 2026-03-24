package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.response.FeedResponse;
import com.example.pfegestionsportive.service.FanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/fan")
@RequiredArgsConstructor
@PreAuthorize("hasRole('FAN')")
public class FanController {

    private final FanService fanService;

    @PostMapping("/follow/{clubId}")
    public ResponseEntity<Void> followClub(@PathVariable String clubId) {
        fanService.followClub(clubId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unfollow/{clubId}")
    public ResponseEntity<Void> unfollowClub(@PathVariable String clubId) {
        fanService.unfollowClub(clubId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/clubs-suivis")
    public ResponseEntity<List<String>> getClubsSuivis() {
        return ResponseEntity.ok(fanService.getClubsSuivisIds());
    }

    @GetMapping("/feed")
    public ResponseEntity<FeedResponse> getMyFeed() {
        return ResponseEntity.ok(fanService.getMyFeed());
    }
}
