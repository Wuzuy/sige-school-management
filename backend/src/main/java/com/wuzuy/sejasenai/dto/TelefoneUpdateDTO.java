package com.wuzuy.sejasenai.dto;

public class TelefoneUpdateDTO {
    private String telefone;

    public TelefoneUpdateDTO() {}

    public TelefoneUpdateDTO(String telefone) {
        this.telefone = telefone;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
}
