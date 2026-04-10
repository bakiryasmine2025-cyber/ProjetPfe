package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.ContratSponsoringRequest;
import com.example.pfegestionsportive.dto.response.ContratSponsoringResponse;
import com.example.pfegestionsportive.model.entity.ContratSponsoring;
import com.example.pfegestionsportive.model.entity.Partenaire;
import com.example.pfegestionsportive.repository.ContratSponsoringRepository;
import com.example.pfegestionsportive.repository.PartenaireRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContratSponsoringService {

    private final ContratSponsoringRepository contratRepository;
    private final PartenaireRepository partenaireRepository;

    // ✅ 3.6 - Créer contrat sponsoring
    public ContratSponsoringResponse create(ContratSponsoringRequest req) {
        Partenaire partenaire = partenaireRepository.findById(req.getPartenaireId())
                .orElseThrow(() -> new RuntimeException("Partenaire introuvable"));

        ContratSponsoring contrat = ContratSponsoring.builder()
                .partenaire(partenaire)
                .typeContrat(req.getTypeContrat())
                .montant(req.getMontant())
                .devise(req.getDevise())
                .dateDebut(req.getDateDebut())
                .dateFin(req.getDateFin())
                .description(req.getDescription())
                .actif(true)
                .build();

        return toResponse(contratRepository.save(contrat));
    }

    public List<ContratSponsoringResponse> getAll() {
        return contratRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ContratSponsoringResponse> getByPartenaire(String partenaireId) {
        return contratRepository.findByPartenaireId(partenaireId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ContratSponsoringResponse update(String id, ContratSponsoringRequest req) {
        ContratSponsoring c = contratRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contrat introuvable"));
        if (req.getMontant() != null)   c.setMontant(req.getMontant());
        if (req.getDevise() != null)    c.setDevise(req.getDevise());
        if (req.getDateDebut() != null) c.setDateDebut(req.getDateDebut());
        if (req.getDateFin() != null)   c.setDateFin(req.getDateFin());
        if (req.getDescription() != null) c.setDescription(req.getDescription());
        return toResponse(contratRepository.save(c));
    }

    public void delete(String id) {
        contratRepository.deleteById(id);
    }

    private ContratSponsoringResponse toResponse(ContratSponsoring c) {
        return ContratSponsoringResponse.builder()
                .id(c.getId())
                .partenaireId(c.getPartenaire().getId())
                .partenaireNom(c.getPartenaire().getNom())
                .typeContrat(c.getTypeContrat() != null ? c.getTypeContrat().name() : null)
                .montant(c.getMontant()).devise(c.getDevise())
                .dateDebut(c.getDateDebut()).dateFin(c.getDateFin())
                .description(c.getDescription()).actif(c.isActif())
                .dateCreation(c.getDateCreation())
                .build();
    }
}
