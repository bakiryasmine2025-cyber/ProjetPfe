package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.dto.JournalAuditDTO;
import com.example.pfegestionsportive.model.entity.JournalAudit;
import com.example.pfegestionsportive.model.entity.Utilisateur;
import com.example.pfegestionsportive.repository.JournalAuditRepository;
import com.example.pfegestionsportive.repository.UtilisateurRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JournalAuditService {

    private final JournalAuditRepository journalAuditRepository;
    private final UtilisateurRepository utilisateurRepository;

    // ─── Enregistrer une action ───────────────────────────────────────────────
    public void enregistrer(
            String action,
            String description,
            String ipAdresse,
            String roleUtilisateur,
            UUID utilisateurId) {

        Utilisateur utilisateur = null;
        if (utilisateurId != null) {
            utilisateur = utilisateurRepository.findById(utilisateurId)
                    .orElse(null);
        }

        JournalAudit journal = JournalAudit.builder()
                .action(action)
                .description(description)
                .ipAdresse(ipAdresse)
                .roleUtilisateur(roleUtilisateur)
                .dateAction(LocalDateTime.now())
                .utilisateur(utilisateur)
                .build();

        journalAuditRepository.save(journal);
    }

    // ─── Lire tous ────────────────────────────────────────────────────────────
    public List<JournalAuditDTO> getAll() {
        return journalAuditRepository.findAllByOrderByDateActionDesc()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ─── Par utilisateur ──────────────────────────────────────────────────────
    public List<JournalAuditDTO> getByUtilisateur(UUID utilisateurId) {
        return journalAuditRepository
                .findByUtilisateurIdOrderByDateDesc(utilisateurId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ─── Par action ───────────────────────────────────────────────────────────
    public List<JournalAuditDTO> getByAction(String action) {
        return journalAuditRepository.findByAction(action)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ─── Par période ──────────────────────────────────────────────────────────
    public List<JournalAuditDTO> getByPeriode(
            LocalDateTime debut, LocalDateTime fin) {
        return journalAuditRepository.findByDateActionBetween(debut, fin)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ─── Supprimer ───────────────────────────────────────────────────────────
    public void delete(UUID id) {
        if (!journalAuditRepository.existsById(id)) {
            throw new EntityNotFoundException("Log non trouvé");
        }
        journalAuditRepository.deleteById(id);
    }

    // ─── Vider tous les logs ──────────────────────────────────────────────────
    public void deleteAll() {
        journalAuditRepository.deleteAll();
    }

    // ─── Mapper ──────────────────────────────────────────────────────────────
    private JournalAuditDTO toDTO(JournalAudit j) {
        return JournalAuditDTO.builder()
                .id(j.getId())
                .action(j.getAction())
                .description(j.getDescription())
                .ipAdresse(j.getIpAdresse())
                .dateAction(j.getDateAction())
                .roleUtilisateur(j.getRoleUtilisateur())
                .utilisateurId(j.getUtilisateur() != null ?
                        j.getUtilisateur().getId() : null)
                .emailUtilisateur(j.getUtilisateur() != null ?
                        j.getUtilisateur().getEmail() : null)
                .build();
    }
}
