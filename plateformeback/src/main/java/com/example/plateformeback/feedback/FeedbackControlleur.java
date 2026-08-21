package com.example.plateformeback.feedback;

import com.example.plateformeback.user.Users;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/feedback")
public class FeedbackControlleur {

    private final FeedbackService feedbackService;

    @PostMapping
public ResponseEntity<?> envoyer(@RequestBody Map<String, Object> payload, Authentication auth) {
    try {
        Users currentUser = (Users) auth.getPrincipal();
        Integer rating = null;

Object ratingRaw = payload.get("rating");

if (ratingRaw != null) {
    rating = ((Number) ratingRaw).intValue();
}

        FeedbackDTO dto = feedbackService.envoyerFeedback(
                currentUser,
                (String) payload.get("subject"),
                (String) payload.get("comment"),
                rating
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
    }
}

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<FeedbackDTO> getAll() {
            System.out.println("🔥🔥🔥 GET /feedback appelé !");

        return feedbackService.getAllFeedbacks();
    }

    @GetMapping("/mes-feedbacks")
    public List<FeedbackDTO> getMesFeedbacks(Authentication auth) {
        Users currentUser = (Users) auth.getPrincipal();
        return feedbackService.getMesFeedbacks(currentUser.getId());
    }
}