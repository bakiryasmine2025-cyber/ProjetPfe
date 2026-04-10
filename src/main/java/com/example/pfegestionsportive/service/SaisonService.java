package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.SaisonRequest;
import com.example.pfegestionsportive.dto.response.SaisonResponse;
import com.example.pfegestionsportive.model.entity.Saison;
import com.example.pfegestionsportive.model.enums.SaisonStatus;
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
        Saison s = Saison.builder()
                .nom(req.getNom()).dateDebut(req.getDateDebut())
                .dateFin(req.getDateFin())
                .statut(SaisonStatus.OUVERTE)
                .active(false)
                .build();
        return toResponse(saisonRepository.save(s));
    }

    public List<SaisonResponse> getAll() {
        return saisonRepository.findAllByOrderByDateCreationDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public SaisonResponse update(String id, SaisonRequest req) {
        Saison s = findById(id);
        if (req.getNom() != null)      s.setNom(req.getNom());
        if (req.getDateDebut() != null) s.setDateDebut(req.getDateDebut());
        if (req.getDateFin() != null)   s.setDateFin(req.getDateFin());
        return toResponse(saisonRepository.save(s));
    }

    // ✅ 3.5 - Activer saison
    public SaisonResponse activate(String id) {
        saisonRepository.findAll().forEach(s -> {
            s.setActive(false);
            saisonRepository.save(s);
        });
        Saison s = findById(id);
        s.setActive(true);
        s.setStatut(SaisonStatus.OUVERTE);
        return toResponse(saisonRepository.save(s));
    }

    // ✅ 3.5 - Clôturer saison
    public SaisonResponse cloturer(String id) {
        Saison s = findById(id);
        if (s.getStatut() == SaisonStatus.CLOTUREE)
            throw new RuntimeException("Saison déjà clôturée");
        s.setStatut(SaisonStatus.CLOTUREE);
        s.setActive(false);
        return toResponse(saisonRepository.save(s));
    }

    // ✅ 3.5 - Archiver saison
    public SaisonResponse archiver(String id) {
        Saison s = findById(id);
        s.setStatut(SaisonStatus.ARCHIVEE);
        s.setActive(false);
        return toResponse(saisonRepository.save(s));
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
                .statut(s.getStatut().name())
                .active(s.isActive())
                .dateCreation(s.getDateCreation())
                .build();
    }
}