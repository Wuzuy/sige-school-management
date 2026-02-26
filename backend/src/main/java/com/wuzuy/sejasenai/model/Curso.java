package com.wuzuy.sejasenai.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "cursos")
public class Curso {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String id_unidade;

    @Column(nullable = false)
    private String nome_curso;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private String turno;

    @Column(nullable = false)
    private LocalDate data_inicio;

    @Column(nullable = false)
    private int duracao_meses;

    @Column(nullable = false)
    private String status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getId_unidade() {
        return id_unidade;
    }

    public void setId_unidade(String id_unidade) {
        this.id_unidade = id_unidade;
    }

    public String getNome_curso() {
        return nome_curso;
    }

    public void setNome_curso(String nome_curso) {
        this.nome_curso = nome_curso;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getTurno() {
        return turno;
    }

    public void setTurno(String turno) {
        this.turno = turno;
    }

    public LocalDate getData_inicio() {
        return data_inicio;
    }

    public void setData_inicio(LocalDate data_inicio) {
        this.data_inicio = data_inicio;
    }

    public int getDuracao_meses() {
        return duracao_meses;
    }

    public void setDuracao_meses(int duracao_meses) {
        this.duracao_meses = duracao_meses;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
