package com.example.plateformeback.consultation;

import com.example.plateformeback.enums.TypeRessourceConsulte;
import com.example.plateformeback.user.Users;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;


@AllArgsConstructor
@RestController
@RequestMapping("/consultations")
public class ConsultationControlleur {

    private final ConsultationService consultationService;

    @PostMapping
    public ResponseEntity<Void> enregistrer(@RequestBody Map<String, Object> payload, Authentication auth) {
        Users user = (Users) auth.getPrincipal();
        TypeRessourceConsulte type = TypeRessourceConsulte.valueOf((String) payload.get("type"));
        Long id = ((Number) payload.get("id")).longValue();
        consultationService.enregistrer(user, type, id);
        return ResponseEntity.noContent().build();
    }
}