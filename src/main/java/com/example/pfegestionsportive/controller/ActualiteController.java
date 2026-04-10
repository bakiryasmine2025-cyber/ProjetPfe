package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.request.CreateActualiteRequest;
import com.example.pfegestionsportive.dto.response.ActualiteResponse;
import com.example.pfegestionsportive.model.entity.Actualite;
import com.example.pfegestionsportive.repository.ActualiteRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/super-admin/actualites")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class ActualiteController {

    private final ActualiteRepository actualiteRepository;

    @GetMapping
    public ResponseEntity<List<ActualiteResponse>> getAll() {
        List<ActualiteResponse> list = actualiteRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getDatePublication().compareTo(a.getDatePublication()))
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<ActualiteResponse> create(@RequestBody @Valid CreateActualiteRequest req) {
        Actualite actualite = Actualite.builder()
                .titre(req.getTitre())
                .contenu(req.getContenu())
                .urlImage(req.getUrlImage())
                .categorie(req.getCategorie()) // <--- Fix: mapping categorie
                .datePublication(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(toResponse(actualiteRepository.save(actualite)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActualiteResponse> update(
            @PathVariable String id,
            @RequestBody @Valid CreateActualiteRequest req) {

        return actualiteRepository.findById(id)
                .map(existing -> {
                    existing.setTitre(req.getTitre());
                    existing.setContenu(req.getContenu());
                    existing.setUrlImage(req.getUrlImage());
                    existing.setCategorie(req.getCategorie()); // <--- Fix: update categorie
                    return ResponseEntity.ok(toResponse(actualiteRepository.save(existing)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!actualiteRepository.existsById(id)) return ResponseEntity.notFound().build();
        actualiteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // --- MAPPER MSALAH ---
    private ActualiteResponse toResponse(Actualite a) {
        return ActualiteResponse.builder()
                .id(a.getId())
                .titre(a.getTitre())
                .contenu(a.getContenu())
                .urlImage(a.getUrlImage())
                .categorie(a.getCategorie()) // <--- Fix: testa3mel "a" mouch "req"
                .datePublication(a.getDatePublication())
                .clubNom(a.getClub() != null ? a.getClub().getNom() : null)
                .build();
    }
}