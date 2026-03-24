package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.service.ClubAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/club-admin")
@RequiredArgsConstructor
public class ClubAdminController {

    private final ClubAdminService clubAdminService;

    // Endpoints for 5.1 and 5.3 will be added here
}
