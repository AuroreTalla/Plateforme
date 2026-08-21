package com.example.plateformeback.feedback;

import com.example.plateformeback.user.Users;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@AllArgsConstructor
@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    @Transactional
    public FeedbackDTO envoyerFeedback(Users user, String subject, String comment, Integer rating) {
    if (subject == null || subject.isBlank()) {
        throw new IllegalArgumentException("Le sujet est requis.");
    }
    if (comment == null || comment.isBlank()) {
        throw new IllegalArgumentException("Le commentaire est requis.");
    }
    if (rating != null && (rating < 1 || rating > 5)) {
        throw new IllegalArgumentException("La note doit être comprise entre 1 et 5.");
    }

    Feedback feedback = new Feedback();
    feedback.setUsers(user);
    feedback.setSubject(subject);
    feedback.setComment(comment);
    feedback.setRating(rating);

    Feedback saved = feedbackRepository.save(feedback);
    return FeedbackDTO.fromEntity(saved);
}

    @Transactional(readOnly = true)    
public List<FeedbackDTO> getAllFeedbacks() {
        return feedbackRepository.findAllByOrderByDateCreationDesc()
                .stream()
                .map(FeedbackDTO::fromEntity)
                .toList();
    }

    public List<FeedbackDTO> getMesFeedbacks(Long userId) {
        return feedbackRepository.findByUsersIdOrderByDateCreationDesc(userId)
                .stream()
                .map(FeedbackDTO::fromEntity)
                .toList();
    }
}