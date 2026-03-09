package com.wuzuy.sejasenai.dto;

import com.wuzuy.sejasenai.model.Role;

public class AdminUserUpdateDTO {
    private String nomeCompleto;
    private String email;
    private String cpf;
    private String telefone;
    private String dataNascimento;
    private Role role;

    public AdminUserUpdateDTO() {}

    public AdminUserUpdateDTO(String nomeCompleto, String email, String cpf, String telefone, String dataNascimento, Role role) {
        this.nomeCompleto = nomeCompleto;
        this.email = email;
        this.cpf = cpf;
        this.telefone = telefone;
        this.dataNascimento = dataNascimento;
        this.role = role;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public void setNomeCompleto(String nomeCompleto) {
        this.nomeCompleto = nomeCompleto;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
