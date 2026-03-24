package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.ClubRequest;
import com.example.pfegestionsportive.dto.response.ClubResponse;
import com.example.pfegestionsportive.model.entity.Club;
import com.example.pfegestionsportive.model.enums.ClubStatus;
import com.example.pfegestionsportive.repository.ClubRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClubService {

    private final ClubRepository clubRepository;

    // ✅ 3.1 - Créer club
    public ClubResponse create(ClubRequest req) {
        if (clubRepository.existsByNom(req.getNom()))
            throw new RuntimeException("Un club avec ce nom existe déjà");

        Club club = Club.builder()
                .nom(req.getNom())
                .nomCourt(req.getNomCourt())
                .ville(req.getVille())
                .region(req.getRegion())
                .anneeFondation(req.getAnneeFondation())
                .email(req.getEmail())
                .telephone(req.getTelephone())
                .urlLogo(req.getUrlLogo())
                .adresse(req.getAdresse())
                .statut(req.getStatut() != null ? req.getStatut() : ClubStatus.ACTIF)
                .build();

        return toResponse(clubRepository.save(club));
    }

    // ✅ 3.1 - Liste clubs
    public List<ClubResponse> getAll() {
        return clubRepository.findAllByOrderByDateCreationDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ✅ 3.1 - Get club by id
    public ClubResponse getById(String id) {
        return toResponse(findById(id));
    }

    // ✅ 3.1 - Modifier club
    public ClubResponse update(String id, ClubRequest req) {
        Club club = findById(id);
        if (req.getNom() != null) club.setNom(req.getNom());
        if (req.getNomCourt() != null) club.setNomCourt(req.getNomCourt());
        if (req.getVille() != null) club.setVille(req.getVille());
        if (req.getRegion() != null) club.setRegion(req.getRegion());
        if (req.getAnneeFondation() != null) club.setAnneeFondation(req.getAnneeFondation());
        if (req.getEmail() != null) club.setEmail(req.getEmail());
        if (req.getTelephone() != null) club.setTelephone(req.getTelephone());
        if (req.getUrlLogo() != null) club.setUrlLogo(req.getUrlLogo());
        if (req.getAdresse() != null) club.setAdresse(req.getAdresse());
        if (req.getStatut() != null) club.setStatut(req.getStatut());
        club.setDateMiseAJour(LocalDateTime.now());
        return toResponse(clubRepository.save(club));
    }

    // ✅ 3.1 - Supprimer club
    public void delete(String id) {
        clubRepository.delete(findById(id));
    }

    // ✅ 3.1 - Changer statut
    public ClubResponse changeStatut(String id, ClubStatus statut) {
        Club club = findById(id);
        club.setStatut(statut);
        club.setDateMiseAJour(LocalDateTime.now());
        return toResponse(clubRepository.save(club));
    }

    private Club findById(String id) {
        return clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Club introuvable"));
    }

    private ClubResponse toResponse(Club c) {
        return ClubResponse.builder()
                .id(c.getId()).nom(c.getNom()).nomCourt(c.getNomCourt())
                .ville(c.getVille()).region(c.getRegion())
                .anneeFondation(c.getAnneeFondation())
                .email(c.getEmail()).telephone(c.getTelephone())
                .urlLogo(c.getUrlLogo()).adresse(c.getAdresse())
                .statut(c.getStatut().name())
                .dateCreation(c.getDateCreation())
                .dateMiseAJour(c.getDateMiseAJour())
                .build();
    }
}
