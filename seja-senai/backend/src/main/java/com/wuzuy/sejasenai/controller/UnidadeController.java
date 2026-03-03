package com.wuzuy.sejasenai.controller;

import com.wuzuy.sejasenai.model.Unidade;
import com.wuzuy.sejasenai.repository.UnidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/unidades")
@CrossOrigin(origins = "*")
public class UnidadeController {

    @Autowired
    private UnidadeRepository repository;

    @GetMapping
    public List<Unidade> getAllUnidades() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Unidade getUnidadeById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PostMapping
    public Unidade saveUnidade(@RequestBody Unidade unidade) {
        return repository.save(unidade);
    }

    @DeleteMapping("/{id}")
    public void deleteUnidade(@PathVariable Long id) {
        repository.deleteById(id);
    }
}