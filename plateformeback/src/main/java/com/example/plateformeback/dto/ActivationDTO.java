package com.example.plateformeback.dto;

public record ActivationDTO(String email, String code) {
    // getters
    public String getEmail() { return email; }
    public String getCode() { return code; }
}

