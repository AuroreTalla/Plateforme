package com.example.plateformeback.stats;

import lombok.AllArgsConstructor;

import java.util.Map;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.plateformeback.consultation.ConsultationService;
import com.example.plateformeback.consultation.RessourcePopulaireDTO;
import com.example.plateformeback.enums.TypeRessourceConsulte;

@AllArgsConstructor
@RestController
@RequestMapping("/admin/stats")
public class StatsControlleur {

    private final StatsService statsService;
    private final ConsultationService consultationService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> getStats() {
        return statsService.getStats();
    }

       @GetMapping("/ressources-populaires")
@PreAuthorize("hasRole('ADMIN')")
public List<RessourcePopulaireDTO> populaires(
        @RequestParam Long matiereId,
        @RequestParam TypeRessourceConsulte type,
        @RequestParam(defaultValue = "10") int limite) {
    return consultationService.populaires(matiereId, type, limite);
}
}
