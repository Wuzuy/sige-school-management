package com.wuzuy.sejasenai.controller;

import com.wuzuy.sejasenai.model.Edital;
import com.wuzuy.sejasenai.repository.EditalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/editais")
@CrossOrigin(origins = "*")
public class EditalController {

    @Autowired
    private EditalRepository repository;

    /**
     * GET /api/editais - Listar todos os editais (público)
     */
    @GetMapping
    public ResponseEntity<List<Edital>> listarEditais() {
        List<Edital> editais = repository.findAll();
        return ResponseEntity.ok(editais);
    }

    /**
     * GET /api/editais/ativos - Listar apenas editais ativos (público)
     */
    @GetMapping("/ativos")
    public ResponseEntity<List<Edital>> listarEditaisAtivos() {
        List<Edital> editais = repository.findByAtivoOrderByIdDesc(true);
        return ResponseEntity.ok(editais);
    }

    /**
     * GET /api/editais/{id} - Buscar edital por ID (público)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarEdital(@PathVariable Long id) {
        Optional<Edital> edital = repository.findById(id);
        
        if (edital.isPresent()) {
            return ResponseEntity.ok(edital.get());
        }
        
        Map<String, String> erro = new HashMap<>();
        erro.put("erro", "Edital não encontrado");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
    }

    /**
     * POST /api/editais - Criar novo edital (ADMIN)
     */
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<Object> criarEdital(@RequestBody Edital edital) {
        try {
            // Validações
            if (edital.getTitulo() == null || edital.getTitulo().trim().isEmpty()) {
                Map<String, String> erro = new HashMap<>();
                erro.put("erro", "Título é obrigatório");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
            }

            if (edital.getUrl() == null || edital.getUrl().trim().isEmpty()) {
                Map<String, String> erro = new HashMap<>();
                erro.put("erro", "URL é obrigatória");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
            }

            // Se ativo não for especificado, define como true
            if (edital.getAtivo() == null) {
                edital.setAtivo(true);
            }

            Edital salvo = repository.save(edital);
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
            
        } catch (Exception e) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Erro ao criar edital: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
        }
    }

    /**
     * PUT /api/editais/{id} - Atualizar edital (ADMIN)
     */
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizarEdital(@PathVariable Long id, @RequestBody Edital editalAtualizado) {
        Optional<Edital> editalExistente = repository.findById(id);
        
        if (!editalExistente.isPresent()) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Edital não encontrado");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
        }

        try {
            Edital edital = editalExistente.get();
            
            if (editalAtualizado.getTitulo() != null) {
                edital.setTitulo(editalAtualizado.getTitulo());
            }
            
            if (editalAtualizado.getUrl() != null) {
                edital.setUrl(editalAtualizado.getUrl());
            }
            
            if (editalAtualizado.getAtivo() != null) {
                edital.setAtivo(editalAtualizado.getAtivo());
            }

            Edital salvo = repository.save(edital);
            return ResponseEntity.ok(salvo);
            
        } catch (Exception e) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Erro ao atualizar edital: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
        }
    }

    /**
     * DELETE /api/editais/{id} - Deletar edital (ADMIN)
     */
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletarEdital(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Edital não encontrado");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
        }

        try {
            repository.deleteById(id);
            
            Map<String, String> sucesso = new HashMap<>();
            sucesso.put("mensagem", "Edital deletado com sucesso");
            return ResponseEntity.ok(sucesso);
            
        } catch (Exception e) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Erro ao deletar edital: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
        }
    }
}
