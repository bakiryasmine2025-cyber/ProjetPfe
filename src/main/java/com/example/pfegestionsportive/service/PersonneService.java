package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.PersonneDTO;
import com.example.pfegestionsportive.model.entity.Club;
import com.example.pfegestionsportive.model.entity.Personne;
import com.example.pfegestionsportive.repository.ClubRepository;
import com.example.pfegestionsportive.repository.PersonneRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PersonneService {

    private final PersonneRepository personneRepository;
    private final ClubRepository clubRepository;

    // ─── Lire ─────────────────────────────────────────────────────────────────

    public List<PersonneDTO> getByClub(UUID clubId) {
        return personneRepository.findByClubId(clubId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<PersonneDTO> getJoueursByClub(UUID clubId) {
        return personneRepository.findJoueursByClubId(clubId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<PersonneDTO> getEntraineursByClub(UUID clubId) {
        return personneRepository.findEntraineursByClubId(clubId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<PersonneDTO> getStaffByClub(UUID clubId) {
        return personneRepository.findStaffByClubId(clubId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public PersonneDTO getById(UUID id) {
        return personneRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new EntityNotFoundException("Personne non trouvée"));
    }

    // ─── User story 5.1 — Créer joueur / entraîneur / staff ──────────────────

    public PersonneDTO create(PersonneDTO dto) {
        Club club = clubRepository.findById(dto.getClubId())
                .orElseThrow(() -> new EntityNotFoundException("Club non trouvé"));

        Personne personne = Personne.builder()
                .prenom(dto.getPrenom())
                .nom(dto.getNom())
                .dateNaissance(dto.getDateNaissance())
                .genre(dto.getGenre())
                .nationalite(dto.getNationalite())
                .email(dto.getEmail())
                .telephone(dto.getTelephone())
                .adresse(dto.getAdresse())
                .urlPhoto(dto.getUrlPhoto())
                .dateCreation(LocalDateTime.now())
                .club(club)
                .build();

        return toDTO(personneRepository.save(personne));
    }

    // ─── User story 5.1 — Modifier joueur / entraîneur / staff ───────────────

    public PersonneDTO update(UUID id, PersonneDTO dto) {
        Personne personne = personneRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Personne non trouvée"));

        personne.setPrenom(dto.getPrenom());
        personne.setNom(dto.getNom());
        personne.setDateNaissance(dto.getDateNaissance());
        personne.setGenre(dto.getGenre());
        personne.setNationalite(dto.getNationalite());
        personne.setEmail(dto.getEmail());
        personne.setTelephone(dto.getTelephone());
        personne.setAdresse(dto.getAdresse());
        personne.setUrlPhoto(dto.getUrlPhoto());

        return toDTO(personneRepository.save(personne));
    }

    // ─── Supprimer ────────────────────────────────────────────────────────────

    public void delete(UUID id) {
        if (!personneRepository.existsById(id)) {
            throw new EntityNotFoundException("Personne non trouvée");
        }
        personneRepository.deleteById(id);
    }

    // ─── Mapper ───────────────────────────────────────────────────────────────

    private PersonneDTO toDTO(Personne p) {
        String typePersonne = "JOUEUR";
        if (p.getProfilStaff() != null) {
            typePersonne = p.getProfilStaff().getTypeStaff().name()
                    .equals("ENTRAINEUR") ? "ENTRAINEUR" : "STAFF";
        } else if (p.getProfilArbitre() != null) {
            typePersonne = "ARBITRE";
        }

        return PersonneDTO.builder()
                .id(p.getId())
                .prenom(p.getPrenom())
                .nom(p.getNom())
                .dateNaissance(p.getDateNaissance())
                .genre(p.getGenre())
                .nationalite(p.getNationalite())
                .email(p.getEmail())
                .telephone(p.getTelephone())
                .adresse(p.getAdresse())
                .urlPhoto(p.getUrlPhoto())
                .dateCreation(p.getDateCreation())
                .clubId(p.getClub() != null ? p.getClub().getId() : null)
                .nomClub(p.getClub() != null ? p.getClub().getNom() : null)
                .typePersonne(typePersonne)
                .build();
    }
}