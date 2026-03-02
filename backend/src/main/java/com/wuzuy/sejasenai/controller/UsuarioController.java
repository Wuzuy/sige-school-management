package com.wuzuy.sejasenai.controller;

import com.wuzuy.sejasenai.dto.LoginDTO;
import com.wuzuy.sejasenai.model.Usuario;
import com.wuzuy.sejasenai.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @GetMapping
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public Usuario findOne(@PathVariable int id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        usuarioRepository.deleteById(id);
    }

    @PostMapping
    public ResponseEntity<Usuario> cadastrar(@RequestBody Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        Usuario salvo = usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginDTO usuarioLogin) {
        Optional<Usuario> usuarioDb = usuarioRepository.findByEmail(usuarioLogin.getEmail());

        if (usuarioDb.isPresent() && usuarioDb.get().getSenha().equals(usuarioLogin.getSenha())) {

            usuarioLogin.setSenha("null");
            return ResponseEntity.ok(usuarioDb.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha inválidos");
        }
    }
}
