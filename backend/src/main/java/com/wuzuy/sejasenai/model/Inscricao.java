package com.wuzuy.sejasenai.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "inscricoes")
public class Inscricao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario id_usuario;

    @ManyToOne
    @JoinColumn
    private Curso id_curso;

    @Column(nullable = false)
    private String id_unidade;

    @Column(nullable = false)
    private LocalDate data_inscricao;

    @Column(nullable = false)
    private String status_aprovacao;

    @Column(nullable = false)
    private String escolaridade_declarada;

    // Dados pessoais da inscrição
    @Column(length = 200)
    private String nome_completo_inscricao;

    @Column(length = 20)
    private String rg_inscricao;

    @Column(length = 14)
    private String cpf_inscricao;

    @Column(length = 20)
    private String telefone_inscricao;

    @Column(length = 100)
    private String email_inscricao;

    private LocalDate data_nascimento_inscricao;

    // Sistema de etapas do processo seletivo
    private LocalDate data_prova;

    @Column(length = 10)
    private String realiza_prova; // "SIM" ou "NAO"

    @Column(length = 50)
    private String situacao_aprovacao_prova; // "APROVADO", "REPROVADO", "AGUARDANDO"

    @Column(length = 10)
    private String lista_espera; // "SIM" ou "NAO"

    @Column(length = 50)
    private String status_matricula; // "PENDENTE", "ACEITA", "RECUSADA", "CONCLUIDA"

    private LocalDate data_aceite_matricula;

    @Column(length = 1000)
    private String observacoes;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Usuario id_usuario) {
        this.id_usuario = id_usuario;
    }

    public Curso getId_curso() {
        return id_curso;
    }

    public void setId_curso(Curso id_curso) {
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

    public String getNome_completo_inscricao() {
        return nome_completo_inscricao;
    }

    public void setNome_completo_inscricao(String nome_completo_inscricao) {
        this.nome_completo_inscricao = nome_completo_inscricao;
    }

    public String getRg_inscricao() {
        return rg_inscricao;
    }

    public void setRg_inscricao(String rg_inscricao) {
        this.rg_inscricao = rg_inscricao;
    }

    public String getCpf_inscricao() {
        return cpf_inscricao;
    }

    public void setCpf_inscricao(String cpf_inscricao) {
        this.cpf_inscricao = cpf_inscricao;
    }

    public String getTelefone_inscricao() {
        return telefone_inscricao;
    }

    public void setTelefone_inscricao(String telefone_inscricao) {
        this.telefone_inscricao = telefone_inscricao;
    }

    public String getEmail_inscricao() {
        return email_inscricao;
    }

    public void setEmail_inscricao(String email_inscricao) {
        this.email_inscricao = email_inscricao;
    }

    public LocalDate getData_nascimento_inscricao() {
        return data_nascimento_inscricao;
    }

    public void setData_nascimento_inscricao(LocalDate data_nascimento_inscricao) {
        this.data_nascimento_inscricao = data_nascimento_inscricao;
    }

    public LocalDate getData_prova() {
        return data_prova;
    }

    public void setData_prova(LocalDate data_prova) {
        this.data_prova = data_prova;
    }

    public String getRealiza_prova() {
        return realiza_prova;
    }

    public void setRealiza_prova(String realiza_prova) {
        this.realiza_prova = realiza_prova;
    }

    public String getSituacao_aprovacao_prova() {
        return situacao_aprovacao_prova;
    }

    public void setSituacao_aprovacao_prova(String situacao_aprovacao_prova) {
        this.situacao_aprovacao_prova = situacao_aprovacao_prova;
    }

    public String getLista_espera() {
        return lista_espera;
    }

    public void setLista_espera(String lista_espera) {
        this.lista_espera = lista_espera;
    }

    public String getStatus_matricula() {
        return status_matricula;
    }

    public void setStatus_matricula(String status_matricula) {
        this.status_matricula = status_matricula;
    }

    public LocalDate getData_aceite_matricula() {
        return data_aceite_matricula;
    }

    public void setData_aceite_matricula(LocalDate data_aceite_matricula) {
        this.data_aceite_matricula = data_aceite_matricula;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}
