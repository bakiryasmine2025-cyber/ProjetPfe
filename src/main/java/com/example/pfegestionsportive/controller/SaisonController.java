package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.SaisonRequest;
import com.example.pfegestionsportive.dto.response.SaisonResponse;
import com.example.pfegestionsportive.service.SaisonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/federation/saisons")
@RequiredArgsConstructor
public class SaisonController {

    private final SaisonService saisonService;

    @GetMapping
    public ResponseEntity<List<SaisonResponse>> getAll() {
        return ResponseEntity.ok(saisonService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SaisonResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(saisonService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<SaisonResponse> create(@RequestBody @Valid SaisonRequest req) {
        return ResponseEntity.ok(saisonService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<SaisonResponse> update(
            @PathVariable String id,
            @RequestBody SaisonRequest req) {
        return ResponseEntity.ok(saisonService.update(id, req));
    }

    @PatchMapping("/{id}/activer")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<SaisonResponse> activate(@PathVariable String id) {
        return ResponseEntity.ok(saisonService.activate(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        saisonService.delete(id);
        return ResponseEntity.ok().build();
    }
}
