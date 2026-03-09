package com.wuzuy.sejasenai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ResetPasswordDTO {

    @NotBlank(message = "Token é obrigatório")
    private String token;

    @NotBlank(message = "Nova senha é obrigatória")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
        message = "Senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial"
    )
    private String newPassword;

    public ResetPasswordDTO() {
    }

    public ResetPasswordDTO(String token, String newPassword) {
        this.token = token;
        this.newPassword = newPassword;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
