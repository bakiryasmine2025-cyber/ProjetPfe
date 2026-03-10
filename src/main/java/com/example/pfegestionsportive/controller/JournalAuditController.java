package com.example.pfegestionsportive.controller;

import com.example.pfegestionsportive.dto.JournalAuditDTO;
import com.example.pfegestionsportive.service.JournalAuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/logs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class JournalAuditController {

    private final JournalAuditService journalAuditService;

    // ── Tous les logs ──
    @GetMapping
    public ResponseEntity<List<JournalAuditDTO>> getAll() {
        return ResponseEntity.ok(journalAuditService.getAll());
    }

    // ── Par utilisateur ──
    @GetMapping("/utilisateur/{id}")
    public ResponseEntity<List<JournalAuditDTO>> getByUtilisateur(
            @PathVariable UUID id) {
        return ResponseEntity.ok(journalAuditService.getByUtilisateur(id));
    }

    // ── Par action ──
    @GetMapping("/action/{action}")
    public ResponseEntity<List<JournalAuditDTO>> getByAction(
            @PathVariable String action) {
        return ResponseEntity.ok(journalAuditService.getByAction(action));
    }

    // ── Par période ──
    @GetMapping("/periode")
    public ResponseEntity<List<JournalAuditDTO>> getByPeriode(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime debut,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime fin) {
        return ResponseEntity.ok(journalAuditService.getByPeriode(debut, fin));
    }

    // ── Supprimer un log ──
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        journalAuditService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ── Vider tous les logs ──
    @DeleteMapping("/vider")
    public ResponseEntity<Void> deleteAll() {
        journalAuditService.deleteAll();
        return ResponseEntity.noContent().build();
    }
}