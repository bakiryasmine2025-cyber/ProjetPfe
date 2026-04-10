package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.ArbitreRequest;
import com.example.pfegestionsportive.dto.response.ArbitreResponse;
import com.example.pfegestionsportive.model.entity.Arbitre;
import com.example.pfegestionsportive.model.entity.Match;
import com.example.pfegestionsportive.model.enums.Gender;
import com.example.pfegestionsportive.model.enums.RefereeLevel;
import com.example.pfegestionsportive.model.enums.ArbitreStatut;
import com.example.pfegestionsportive.repository.ArbitreRepository;
import com.example.pfegestionsportive.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArbitreService {

    private final ArbitreRepository arbitreRepository;
    private final MatchRepository matchRepository;

    @Value("${app.upload.dir:uploads/certifications}")
    private String uploadDir;

    public List<ArbitreResponse> getAll() {
        return arbitreRepository.findAll()
                .stream().map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ArbitreResponse create(ArbitreRequest req, MultipartFile certification) throws IOException {
        Arbitre arbitre = Arbitre.builder()
                .id(UUID.randomUUID().toString())
                .nom(req.getNom())
                .prenom(req.getPrenom())
                .email(req.getEmail())
                .telephone(req.getTelephone())
                .adresse(req.getAdresse())
                .dateNaissance(req.getDateNaissance())
                .genre(req.getGenre() != null ? Gender.valueOf(req.getGenre()) : null)
                .niveau(req.getNiveau() != null ? RefereeLevel.valueOf(req.getNiveau()) : null)
                .qualification(req.getQualification())
                .certificationDate(req.getCertificationDate())
                .disponibilite(req.getDisponibilite())
                .anneesExperience(req.getAnneesExperience())
                .federationArbitrage(req.getFederationArbitrage())
                .build();

        if (certification != null && !certification.isEmpty()) {
            arbitre.setCheminCertification(saveCertification(certification));
        }

        return toResponse(arbitreRepository.save(arbitre));
    }

    public ArbitreResponse update(String id, ArbitreRequest req, MultipartFile certification) throws IOException {
        Arbitre arbitre = arbitreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Arbitre introuvable"));

        arbitre.setNom(req.getNom());
        arbitre.setPrenom(req.getPrenom());
        arbitre.setEmail(req.getEmail());
        arbitre.setTelephone(req.getTelephone());
        arbitre.setAdresse(req.getAdresse());
        arbitre.setDateNaissance(req.getDateNaissance());

        if (req.getGenre() != null) arbitre.setGenre(Gender.valueOf(req.getGenre()));
        if (req.getNiveau() != null) arbitre.setNiveau(RefereeLevel.valueOf(req.getNiveau()));

        arbitre.setQualification(req.getQualification());
        arbitre.setCertificationDate(req.getCertificationDate());
        arbitre.setDisponibilite(req.getDisponibilite());
        arbitre.setAnneesExperience(req.getAnneesExperience());
        arbitre.setFederationArbitrage(req.getFederationArbitrage());


        if (req.getStatut() != null) arbitre.setStatut(ArbitreStatut.valueOf(req.getStatut()));

        if (certification != null && !certification.isEmpty())
            arbitre.setCheminCertification(saveCertification(certification));

        return toResponse(arbitreRepository.save(arbitre));
    }

    public void delete(String id) {
        if (!arbitreRepository.existsById(id)) {
            throw new RuntimeException("Arbitre introuvable");
        }
        arbitreRepository.deleteById(id);
    }

    public Match assignerMatch(String matchId, String arbitreId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match introuvable"));
        Arbitre arbitre = arbitreRepository.findById(arbitreId)
                .orElseThrow(() -> new RuntimeException("Arbitre introuvable"));
        match.setArbitre(arbitre);
        return matchRepository.save(match);
    }

    private String saveCertification(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get(uploadDir, filename);
        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());
        return filename;
    }

    private ArbitreResponse toResponse(Arbitre a) {
        return ArbitreResponse.builder()
                .id(a.getId())
                .nom(a.getNom())
                .prenom(a.getPrenom())
                .email(a.getEmail())
                .telephone(a.getTelephone())
                .adresse(a.getAdresse())
                .dateNaissance(a.getDateNaissance())
                .genre(a.getGenre() != null ? a.getGenre().name() : null)
                .niveau(a.getNiveau() != null ? a.getNiveau().name() : null)
                .qualification(a.getQualification())
                .certificationDate(a.getCertificationDate())
                .disponibilite(a.getDisponibilite())
                .anneesExperience(a.getAnneesExperience())
                .federationArbitrage(a.getFederationArbitrage())
                .cheminCertification(a.getCheminCertification())
                .statut(a.getStatut() != null ? a.getStatut().name() : null)
                .build();
    }
}
