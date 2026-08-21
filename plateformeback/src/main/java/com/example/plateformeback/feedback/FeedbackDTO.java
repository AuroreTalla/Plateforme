package com.example.plateformeback.feedback;

import com.example.plateformeback.user.UserDTO;
import java.time.format.DateTimeFormatter;

public record FeedbackDTO(
        Long id,
        String subject,
        String comment,
        Integer rating,
        String dateCreation,
        UserDTO user
) {
    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    public static FeedbackDTO fromEntity(Feedback feedback) {
        return new FeedbackDTO(
                feedback.getId(),
                feedback.getSubject(),
                feedback.getComment(),
                feedback.getRating(),
                feedback.getDateCreation().format(FORMATTER),
                UserDTO.fromEntity(feedback.getUsers())
        );
    }
}