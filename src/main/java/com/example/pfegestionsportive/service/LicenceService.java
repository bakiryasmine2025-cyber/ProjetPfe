package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.model.Licence;

import java.util.List;
import java.util.UUID;

public interface LicenceService {
    Licence createLicence(Licence licence);
    List<Licence> getAllLicences();
    Licence getLicenceById(UUID id);
    Licence updateLicence(UUID id, Licence licence);
    void deleteLicence(UUID id);
    List<Licence> getLicencesByClub(Long clubId);
    List<Licence> getLicencesByUser(Long userId);
    List<Licence> getLicencesByStatut(String statut);
}
