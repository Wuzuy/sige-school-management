package com.wuzuy.sejasenai.controller;

import com.wuzuy.sejasenai.model.Inscricao;
import com.wuzuy.sejasenai.repository.InscricaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/inscricoes")
@CrossOrigin(origins = "*")
public class InscricaoController {

    @Autowired
    private InscricaoRepository repository;

    @GetMapping
    public List<Inscricao> getAllInscricao() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Inscricao getInscricaoById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PostMapping
    public Inscricao saveInscricao(@RequestBody Inscricao inscricao) {
        return repository.save(inscricao);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inscricao> updateInscricao(@PathVariable Long id, @RequestBody Inscricao inscricaoDetails) {
        return repository.findById(id)
            .map(inscricao -> {
                // Atualizar campos básicos
                if (inscricaoDetails.getStatus_aprovacao() != null) {
                    inscricao.setStatus_aprovacao(inscricaoDetails.getStatus_aprovacao());
                }
                if (inscricaoDetails.getEscolaridade_declarada() != null) {
                    inscricao.setEscolaridade_declarada(inscricaoDetails.getEscolaridade_declarada());
                }
                
                // Atualizar campos pessoais
                if (inscricaoDetails.getNome_completo_inscricao() != null) {
                    inscricao.setNome_completo_inscricao(inscricaoDetails.getNome_completo_inscricao());
                }
                if (inscricaoDetails.getRg_inscricao() != null) {
                    inscricao.setRg_inscricao(inscricaoDetails.getRg_inscricao());
                }
                if (inscricaoDetails.getCpf_inscricao() != null) {
                    inscricao.setCpf_inscricao(inscricaoDetails.getCpf_inscricao());
                }
                if (inscricaoDetails.getTelefone_inscricao() != null) {
                    inscricao.setTelefone_inscricao(inscricaoDetails.getTelefone_inscricao());
                }
                if (inscricaoDetails.getEmail_inscricao() != null) {
                    inscricao.setEmail_inscricao(inscricaoDetails.getEmail_inscricao());
                }
                if (inscricaoDetails.getData_nascimento_inscricao() != null) {
                    inscricao.setData_nascimento_inscricao(inscricaoDetails.getData_nascimento_inscricao());
                }
                
                // Atualizar campos de etapas do processo
                if (inscricaoDetails.getRealiza_prova() != null) {
                    inscricao.setRealiza_prova(inscricaoDetails.getRealiza_prova());
                }
                if (inscricaoDetails.getData_prova() != null) {
                    inscricao.setData_prova(inscricaoDetails.getData_prova());
                }
                if (inscricaoDetails.getSituacao_aprovacao_prova() != null) {
                    inscricao.setSituacao_aprovacao_prova(inscricaoDetails.getSituacao_aprovacao_prova());
                }
                if (inscricaoDetails.getLista_espera() != null) {
                    inscricao.setLista_espera(inscricaoDetails.getLista_espera());
                }
                if (inscricaoDetails.getStatus_matricula() != null) {
                    inscricao.setStatus_matricula(inscricaoDetails.getStatus_matricula());
                }
                if (inscricaoDetails.getData_aceite_matricula() != null) {
                    inscricao.setData_aceite_matricula(inscricaoDetails.getData_aceite_matricula());
                }
                if (inscricaoDetails.getObservacoes() != null) {
                    inscricao.setObservacoes(inscricaoDetails.getObservacoes());
                }
                
                return ResponseEntity.ok(repository.save(inscricao));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/matricula")
    public ResponseEntity<Inscricao> updateMatricula(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return repository.findById(id)
            .map(inscricao -> {
                if (updates.containsKey("status_matricula")) {
                    inscricao.setStatus_matricula((String) updates.get("status_matricula"));
                }
                if (updates.containsKey("data_aceite_matricula")) {
                    String dataStr = (String) updates.get("data_aceite_matricula");
                    if (dataStr != null && !dataStr.isEmpty()) {
                        inscricao.setData_aceite_matricula(LocalDate.parse(dataStr));
                    }
                }
                return ResponseEntity.ok(repository.save(inscricao));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/etapas")
    public ResponseEntity<Inscricao> updateEtapas(@PathVariable Long id, @RequestBody Map<String, Object> etapas) {
        return repository.findById(id)
            .map(inscricao -> {
                if (etapas.containsKey("status_aprovacao")) {
                    inscricao.setStatus_aprovacao((String) etapas.get("status_aprovacao"));
                }
                if (etapas.containsKey("realiza_prova")) {
                    inscricao.setRealiza_prova((String) etapas.get("realiza_prova"));
                }
                if (etapas.containsKey("data_prova")) {
                    String dataProvaStr = (String) etapas.get("data_prova");
                    if (dataProvaStr != null && !dataProvaStr.isEmpty()) {
                        inscricao.setData_prova(LocalDate.parse(dataProvaStr));
                    }
                }
                if (etapas.containsKey("situacao_aprovacao_prova")) {
                    inscricao.setSituacao_aprovacao_prova((String) etapas.get("situacao_aprovacao_prova"));
                }
                if (etapas.containsKey("lista_espera")) {
                    inscricao.setLista_espera((String) etapas.get("lista_espera"));
                }
                if (etapas.containsKey("status_matricula")) {
                    inscricao.setStatus_matricula((String) etapas.get("status_matricula"));
                }
                if (etapas.containsKey("observacoes")) {
                    inscricao.setObservacoes((String) etapas.get("observacoes"));
                }
                return ResponseEntity.ok(repository.save(inscricao));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void deleteInscricao(@PathVariable Long id) {
        repository.deleteById(id);
    }
}

