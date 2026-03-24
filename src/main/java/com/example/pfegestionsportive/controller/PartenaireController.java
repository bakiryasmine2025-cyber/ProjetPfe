package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.PartenaireRequest;
import com.example.pfegestionsportive.dto.response.PartenaireResponse;
import com.example.pfegestionsportive.service.PartenaireService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/federation/partenaires")
@RequiredArgsConstructor
public class PartenaireController {

    private final PartenaireService partenaireService;

    @GetMapping
    public ResponseEntity<List<PartenaireResponse>> getAll() {
        return ResponseEntity.ok(partenaireService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartenaireResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(partenaireService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<PartenaireResponse> create(@RequestBody @Valid PartenaireRequest req) {
        return ResponseEntity.ok(partenaireService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<PartenaireResponse> update(
            @PathVariable String id,
            @RequestBody PartenaireRequest req) {
        return ResponseEntity.ok(partenaireService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        partenaireService.delete(id);
        return ResponseEntity.ok().build();
    }
}
