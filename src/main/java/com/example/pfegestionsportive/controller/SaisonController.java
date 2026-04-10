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

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<SaisonResponse> create(@RequestBody @Valid SaisonRequest req) {
        return ResponseEntity.ok(saisonService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<SaisonResponse> update(
            @PathVariable String id, @RequestBody SaisonRequest req) {
        return ResponseEntity.ok(saisonService.update(id, req));
    }

    // ✅ 3.5 - Ouvrir (activer)
    @PatchMapping("/{id}/activer")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<SaisonResponse> activer(@PathVariable String id) {
        return ResponseEntity.ok(saisonService.activate(id));
    }

    // ✅ 3.5 - Clôturer
    @PatchMapping("/{id}/cloturer")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<SaisonResponse> cloturer(@PathVariable String id) {
        return ResponseEntity.ok(saisonService.cloturer(id));
    }

    // ✅ 3.5 - Archiver
    @PatchMapping("/{id}/archiver")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<SaisonResponse> archiver(@PathVariable String id) {
        return ResponseEntity.ok(saisonService.archiver(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        saisonService.delete(id);
        return ResponseEntity.ok().build();
    }
}