package com.wuzuy.sejasenai.config;

<<<<<<< yago
package com.wuzuy.sejasenai.config;
=======
package com.senai.sejasenai.config;
>>>>>>> main

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Trata erros de duplicidade (como email ou CPF ja cadastrados)
    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleConflict(Exception ex) {
        Map<String, String> erro = new HashMap<>();
        erro.put("erro", "Dados ja cadastrados ou campos obrigatorios ausentes.");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(erro);
    }

    // Trata erros genericos para nao expor o stacktrace ao frontend
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneral(Exception ex) {
        Map<String, String> erro = new HashMap<>();
        erro.put("erro", "Ocorreu um erro interno no servidor.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
    }
}