package com.wuzuy.sejasenai.config;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class PasswordValidator {

    // Senha forte: mínimo 8 caracteres, pelo menos 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$"
    );

    /**
     * Valida se a senha atende aos requisitos de segurança
     * @param password senha a ser validada
     * @return true se a senha for forte, false caso contrário
     */
    public boolean isValid(String password) {
        if (password == null || password.isEmpty()) {
            return false;
        }
        return PASSWORD_PATTERN.matcher(password).matches();
    }

    /**
     * Retorna mensagem descritiva dos requisitos de senha
     */
    public String getRequirements() {
        return "A senha deve conter no mínimo 8 caracteres, incluindo: " +
               "1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial (@#$%^&+=!)";
    }
}
