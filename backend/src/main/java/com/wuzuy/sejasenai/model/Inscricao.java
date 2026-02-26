package com.wuzuy.sejasenai.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "inscricoes")
public class Inscricao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long id_usuario;

    @Column(nullable = false)
    private Long id_curso;

    @Column(nullable = false)
    private String id_unidade;

    @Column(nullable = false)
    private LocalDate data_inscricao;

    @Column(nullable = false)
    private String status_aprovacao;

    @Column(nullable = false)
    private String escolaridade_declarada;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Long id_usuario) {
        this.id_usuario = id_usuario;
    }

    public Long getId_curso() {
        return id_curso;
    }

    public void setId_curso(Long id_curso) {
        this.id_curso = id_curso;
    }

    public String getId_unidade() {
        return id_unidade;
    }

    public void setId_unidade(String id_unidade) {
        this.id_unidade = id_unidade;
    }

    public LocalDate getData_inscricao() {
        return data_inscricao;
    }

    public void setData_inscricao(LocalDate data_inscricao) {
        this.data_inscricao = data_inscricao;
    }

    public String getStatus_aprovacao() {
        return status_aprovacao;
    }

    public void setStatus_aprovacao(String status_aprovacao) {
        this.status_aprovacao = status_aprovacao;
    }

    public String getEscolaridade_declarada() {
        return escolaridade_declarada;
    }

    public void setEscolaridade_declarada(String escolaridade_declarada) {
        this.escolaridade_declarada = escolaridade_declarada;
    }
}
