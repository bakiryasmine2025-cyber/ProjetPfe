package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.request.LicenceRequest;
import com.example.pfegestionsportive.dto.response.LicenceResponse;
import com.example.pfegestionsportive.model.entity.*;
import com.example.pfegestionsportive.model.enums.*;
import com.example.pfegestionsportive.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LicenceService {

    private final LicenceRepository licenceRepository;
    private final PersonneRepository personneRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    public LicenceResponse createLicence(LicenceRequest req) {
        Personne personne = personneRepository.findById(req.getPersonneId())
                .orElseThrow(() -> new RuntimeException("Personne introuvable"));

        Licence licence = Licence.builder()
                .numero(req.getNumero())
                .type(req.getType())
                .dateEmission(req.getDateEmission())
                .dateExpiration(req.getDateExpiration())
                .aptitudeMedicale(req.getAptitudeMedicale())
                .personne(personne)
                .club(personne.getClub())
                .build();

        return toResponse(licenceRepository.save(licence));
    }

    public LicenceResponse verifyLicence(String licenceId) {
        Licence licence = licenceRepository.findById(licenceId)
                .orElseThrow(() -> new RuntimeException("Licence introuvable"));
        licence.setStatut(LicenceStatus.ACTIVE);
        return toResponse(licenceRepository.save(licence));
    }

    public LicenceResponse suspendreLicence(String licenceId, String raison) {
        Licence licence = licenceRepository.findById(licenceId)
                .orElseThrow(() -> new RuntimeException("Licence introuvable"));

        licence.setStatut(LicenceStatus.SUSPENDED);
        Licence saved = licenceRepository.save(licence);

        // Message automatique (comme Sprint 1)
        User admin = userRepository.findFirstByRole(Role.FEDERATION_ADMIN).orElseThrow();
        Message msg = Message.builder()
                .sender(admin)
                .receiver(userRepository.findByEmail(licence.getPersonne().getEmail()).orElseThrow())
                .sujet("Votre licence a été suspendue")
                .contenu("Bonjour " + licence.getPersonne().getNom() +
                        ",\n\nVotre licence a été suspendue.\nRaison : " + raison +
                        "\n\nL'équipe Rugby Tunisie")
                .build();
        messageRepository.save(msg);

        return toResponse(saved);
    }

    public List<LicenceResponse> getAllLicences() {
        return licenceRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public LicenceResponse getLicenceById(String id) {
        return licenceRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Licence introuvable avec l'ID : " + id));
    }

    private LicenceResponse toResponse(Licence l) {
        return LicenceResponse.builder()
                .id(l.getId())
                .numero(l.getNumero())
                .type(l.getType().name())
                .dateEmission(l.getDateEmission())
                .dateExpiration(l.getDateExpiration())
                .statut(l.getStatut().name())
                .aptitudeMedicale(l.getAptitudeMedicale())
                .personneNom(l.getPersonne().getNom() + " " + l.getPersonne().getPrenom())
                .clubNom(l.getClub() != null ? l.getClub().getNom() : null)
                .build();
    }

    public List<LicenceResponse> getLicencesByClubAdmin() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (user.getClub() == null)
            throw new RuntimeException("Vous n'êtes associé à aucun club.");

        return licenceRepository.findAll().stream()
                .filter(l -> l.getClub() != null && l.getClub().getId().equals(user.getClub().getId()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

}
