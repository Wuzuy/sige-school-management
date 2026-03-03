package com.wuzuy.sejasenai.controller;

import com.wuzuy.sejasenai.model.Role;
import com.wuzuy.sejasenai.model.Usuario;
import com.wuzuy.sejasenai.repository.UsuarioRepository;
import com.wuzuy.sejasenai.dto.LoginDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @GetMapping
    public List<Usuario> list() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<Usuario> register(@RequestBody Usuario user) {
        try {
            user.setSenha(encoder.encode(user.getSenha()));
            Usuario salvo = repository.save(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginDTO login) {
        Optional<Usuario> userDb = repository.findByEmail(login.getEmail());

        if (userDb.isPresent() && encoder.matches(login.getSenha(), userDb.get().getSenha())) {
            userDb.get().setSenha(null);
            return ResponseEntity.ok(userDb.get());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
    }

    // Altera o papel (Role) de um utilizador existente (Apenas ADMIN)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}/role")
    public ResponseEntity<Usuario> updateRole(@PathVariable Long id, @RequestParam Role role) {
        Optional<Usuario> userDb = repository.findById(id);

        if (userDb.isPresent()) {
            Usuario user = userDb.get();
            user.setRole(role);
            return ResponseEntity.ok(repository.save(user));
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}