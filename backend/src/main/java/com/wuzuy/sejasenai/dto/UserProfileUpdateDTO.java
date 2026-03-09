package com.wuzuy.sejasenai.dto;

public class UserProfileUpdateDTO {
    private String nomeCompleto;
    private String telefone;
    private String dataNascimento;

    public UserProfileUpdateDTO() {}

    public UserProfileUpdateDTO(String nomeCompleto, String telefone, String dataNascimento) {
        this.nomeCompleto = nomeCompleto;
        this.telefone = telefone;
        this.dataNascimento = dataNascimento;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public void setNomeCompleto(String nomeCompleto) {
        this.nomeCompleto = nomeCompleto;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(String dataNascimento) {
        this.dataNascimento = dataNascimento;
    }
}
