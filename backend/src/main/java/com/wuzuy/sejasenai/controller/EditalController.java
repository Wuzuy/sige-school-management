package com.wuzuy.sejasenai.controller;

import com.wuzuy.sejasenai.model.Edital;
import com.wuzuy.sejasenai.repository.EditalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/editais")
@CrossOrigin(origins = "*")
public class EditalController {

    @Autowired
    private EditalRepository repository;

    @GetMapping
    public List<Edital> listAll() {
        return repository.findAll();
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<Edital> create(@RequestBody Edital edital) {
        return ResponseEntity.ok(repository.save(edital));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Edital> update(@PathVariable Long id, @RequestBody Edital input) {
        Optional<Edital> editalDb = repository.findById(id);

        if (editalDb.isPresent()) {
            Edital edital = editalDb.get();
            edital.setTitulo(input.getTitulo());
            edital.setUrl(input.getUrl());
            edital.setAtivo(input.isAtivo());
            return ResponseEntity.ok(repository.save(edital));
        }

        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}
