package com.wuzuy.sejasenai.controller;

import com.wuzuy.sejasenai.model.Inscricao;
import com.wuzuy.sejasenai.repository.InscricaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @DeleteMapping("/{id}")
    public void deleteInscricao(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
