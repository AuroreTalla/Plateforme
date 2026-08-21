package com.example.plateformeback.password;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PasswordResetRepository extends JpaRepository<PasswordReset, Long> {
    Optional<PasswordReset> findByCode(String code);
    void deleteAllByUsersId(Long userId);
}