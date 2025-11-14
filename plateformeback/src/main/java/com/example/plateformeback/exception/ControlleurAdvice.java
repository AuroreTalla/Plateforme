package com.example.plateformeback.exception;

import com.example.plateformeback.dto.ErrorEntity;
import com.example.plateformeback.verificationEmail.CodeInvalideException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@ControllerAdvice
public class ControlleurAdvice {

    //erreur utilisateur non trouve
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(EntityNotFoundException.class)
    public @ResponseBody ErrorEntity handleEntityNotFound(EntityNotFoundException ex) {
        return new ErrorEntity(null, ex.getMessage());
    }

    //erreur email deja utilise
    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public @ResponseBody ErrorEntity handleConflict(DataIntegrityViolationException ex) {
        return new ErrorEntity(null, "Cet email est déjà utilisé.");
    }

    //erreur connexion au serveur
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public @ResponseBody ErrorEntity handleGeneralError(Exception ex) {
        return new ErrorEntity(null, "Erreur interne du serveur.");
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public @ResponseBody ErrorEntity handleIllegalArgument(IllegalArgumentException ex) {
        return new ErrorEntity(null, ex.getMessage());
    }

    //erreur code entre invalide
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(CodeInvalideException.class)
    public @ResponseBody ErrorEntity handleCodeInvalide(CodeInvalideException ex) {
        return new ErrorEntity("CODE_INVALID", ex.getMessage());
    }

}
