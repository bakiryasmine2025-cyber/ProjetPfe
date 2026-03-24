package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.SaisonRequest;
import com.example.pfegestionsportive.dto.response.SaisonResponse;
import com.example.pfegestionsportive.model.entity.Saison;
import com.example.pfegestionsportive.repository.SaisonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaisonService {

    private final SaisonRepository saisonRepository;

    public SaisonResponse create(SaisonRequest req) {
        Saison saison = Saison.builder()
                .nom(req.getNom())
                .dateDebut(req.getDateDebut())
                .dateFin(req.getDateFin())
                .active(req.isActive())
                .build();
        return toResponse(saisonRepository.save(saison));
    }

    public List<SaisonResponse> getAll() {
        return saisonRepository.findAllByOrderByDateCreationDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public SaisonResponse getById(String id) {
        return toResponse(findById(id));
    }

    public SaisonResponse update(String id, SaisonRequest req) {
        Saison s = findById(id);
        if (req.getNom() != null) s.setNom(req.getNom());
        if (req.getDateDebut() != null) s.setDateDebut(req.getDateDebut());
        if (req.getDateFin() != null) s.setDateFin(req.getDateFin());
        s.setActive(req.isActive());
        return toResponse(saisonRepository.save(s));
    }

    // ✅ 3.3 - Activer une saison (désactive les autres)
    public SaisonResponse activate(String id) {
        // Désactiver toutes
        saisonRepository.findAll().forEach(s -> {
            s.setActive(false);
            saisonRepository.save(s);
        });
        // Activer celle-ci
        Saison saison = findById(id);
        saison.setActive(true);
        return toResponse(saisonRepository.save(saison));
    }

    public void delete(String id) {
        saisonRepository.delete(findById(id));
    }

    private Saison findById(String id) {
        return saisonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Saison introuvable"));
    }

    private SaisonResponse toResponse(Saison s) {
        return SaisonResponse.builder()
                .id(s.getId()).nom(s.getNom())
                .dateDebut(s.getDateDebut()).dateFin(s.getDateFin())
                .active(s.isActive()).dateCreation(s.getDateCreation())
                .build();
    }
}
