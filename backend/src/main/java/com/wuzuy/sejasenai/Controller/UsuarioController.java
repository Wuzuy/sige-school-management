package com.wuzuy.sejasenai.Controller;

import com.wuzuy.sejasenai.dto.LoginDto;
import com.wuzuy.sejasenai.model.Usuario;
import com.wuzuy.sejasenai.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    @PostMapping
    public Usuario save(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @GetMapping("/{id}")
    public Usuario findOne(@PathVariable int id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        usuarioRepository.deleteById(id);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginDto usuarioLogin) {
        Optional<Usuario> usuarioDb = usuarioRepository.findByEmail(usuarioLogin.getEmail());

        if (usuarioDb.isPresent() && usuarioDb.get().getSenha().equals(usuarioLogin.getSenha())) {
            Usuario usuario = usuarioDb.get();
            usuario.setSenha(null);
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha inválidos");
        }
    }
}
