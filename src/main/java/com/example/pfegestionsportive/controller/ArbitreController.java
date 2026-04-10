package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.response.ArbitreResponse;
import com.example.pfegestionsportive.dto.request.ArbitreRequest;
import com.example.pfegestionsportive.model.entity.Match;
import com.example.pfegestionsportive.service.ArbitreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/federation/arbitres")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')")
public class ArbitreController {

    private final ArbitreService arbitreService;

    @GetMapping
    public ResponseEntity<List<ArbitreResponse>> getAll() {
        return ResponseEntity.ok(arbitreService.getAll());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ArbitreResponse> create(
            @RequestPart("data") @Valid ArbitreRequest req,
            @RequestPart(value = "certification", required = false) MultipartFile certification
    ) throws IOException {
        return ResponseEntity.ok(arbitreService.create(req, certification));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ArbitreResponse> update(
            @PathVariable String id,
            @RequestPart("data") @Valid ArbitreRequest req,
            @RequestPart(value = "certification", required = false) MultipartFile certification
    ) throws IOException {
        return ResponseEntity.ok(arbitreService.update(id, req, certification));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        arbitreService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{arbitreId}/assigner/{matchId}")
    public ResponseEntity<Match> assignerMatch(
            @PathVariable String arbitreId,
            @PathVariable String matchId) {
        return ResponseEntity.ok(arbitreService.assignerMatch(matchId, arbitreId));
    }
}
