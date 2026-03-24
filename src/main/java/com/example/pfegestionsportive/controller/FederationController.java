package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.model.entity.Equipe;
import com.example.pfegestionsportive.repository.EquipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/federation")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
public class FederationController {

    private final EquipeRepository equipeRepository;

    @GetMapping("/equipes")
    public ResponseEntity<List<Equipe>> getAllEquipes() {
        return ResponseEntity.ok(equipeRepository.findAll());
    }
}