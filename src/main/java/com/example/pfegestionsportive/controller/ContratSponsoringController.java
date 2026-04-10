package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.ContratSponsoringRequest;
import com.example.pfegestionsportive.dto.response.ContratSponsoringResponse;
import com.example.pfegestionsportive.service.ContratSponsoringService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/federation/contrats")
@RequiredArgsConstructor
public class ContratSponsoringController {

    private final ContratSponsoringService contratService;

    @GetMapping
    public ResponseEntity<List<ContratSponsoringResponse>> getAll() {
        return ResponseEntity.ok(contratService.getAll());
    }

    @GetMapping("/partenaire/{partenaireId}")
    public ResponseEntity<List<ContratSponsoringResponse>> getByPartenaire(
            @PathVariable String partenaireId) {
        return ResponseEntity.ok(contratService.getByPartenaire(partenaireId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<ContratSponsoringResponse> create(
            @RequestBody @Valid ContratSponsoringRequest req) {
        return ResponseEntity.ok(contratService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<ContratSponsoringResponse> update(
            @PathVariable String id,
            @RequestBody ContratSponsoringRequest req) {
        return ResponseEntity.ok(contratService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','FEDERATION_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        contratService.delete(id);
        return ResponseEntity.ok().build();
    }
}
