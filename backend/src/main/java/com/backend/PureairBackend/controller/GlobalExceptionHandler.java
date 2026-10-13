package com.backend.PureairBackend.controller;


import jakarta.validation.ConstraintViolationException;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// Global hata yönetimi için RestControllerAdvice
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Doğrulama hatalarını (örneğin @Valid veya @Validated) yönetir
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(ConstraintViolationException ex) {
        ErrorResponse error = new ErrorResponse("Doğrulama Hatası", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // RuntimeException'ları yönetir
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        ErrorResponse error = new ErrorResponse("Runtime Error", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Diğer tüm yakalanmamış hataları yönetir
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralErrors(Exception ex) {
        ErrorResponse error = new ErrorResponse("Sunucu Hatası", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Hata yanıtlarını standartlaştırmak için iç sınıf
    @Getter
    @Setter
    static class ErrorResponse {
        private String message;
        private String details;

        public ErrorResponse(String message, String details) {
            this.message = message;
            this.details = details;
        }
    }
}