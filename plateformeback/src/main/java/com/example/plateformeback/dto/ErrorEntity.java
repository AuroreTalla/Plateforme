package com.example.plateformeback.dto;

public class ErrorEntity {
    private String code;
    private String message;

    public ErrorEntity(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public String getCode() { return code; }

    public String getMessage() { return message; }

    public void setCode(String code) { this.code = code; }

    public void setMessage(String message) { this.message = message; }
}
