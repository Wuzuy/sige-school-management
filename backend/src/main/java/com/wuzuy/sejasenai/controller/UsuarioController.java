package com.wuzuy.sejasenai.controller;

import com.wuzuy.sejasenai.config.JwtService;
import com.wuzuy.sejasenai.dto.AdminUserCreateDTO;
import com.wuzuy.sejasenai.dto.AdminUserUpdateDTO;
import com.wuzuy.sejasenai.model.Role;
import com.wuzuy.sejasenai.model.Usuario;
import com.wuzuy.sejasenai.repository.UsuarioRepository;
import com.wuzuy.sejasenai.dto.LoginDTO;
import com.wuzuy.sejasenai.dto.LoginResponseDTO;
import com.wuzuy.sejasenai.dto.TelefoneUpdateDTO;
import com.wuzuy.sejasenai.dto.UserProfileUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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

    @Autowired
    private JwtService jwtService;

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public List<Usuario> list() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<Usuario> register(@RequestBody Usuario user) {
        try {
            user.setSenha(encoder.encode(user.getSenha()));
            user.setRole(Role.ROLE_USER);
            Usuario salvo = repository.save(user);
            salvo.setSenha(null);
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/admin")
    public ResponseEntity<Usuario> registerByAdmin(@RequestBody AdminUserCreateDTO input) {
        try {
            Usuario user = new Usuario();
            user.setNomeCompleto(input.getNomeCompleto());
            user.setEmail(input.getEmail());
            user.setSenha(encoder.encode(input.getSenha()));
            user.setCpf(input.getCpf());
            user.setTelefone(input.getTelefone());
            user.setDataNascimento(input.getDataNascimento());
            user.setRole(input.getRole() == null ? Role.ROLE_USER : input.getRole());

            Usuario salvo = repository.save(user);
            salvo.setSenha(null);
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginDTO login) {
        Optional<Usuario> userDb = repository.findByEmail(login.getEmail());

        if (userDb.isPresent() && encoder.matches(login.getSenha(), userDb.get().getSenha())) {
            Usuario usuario = userDb.get();
            String token = jwtService.generateToken(usuario.getEmail());
            usuario.setSenha(null);
            return ResponseEntity.ok(new LoginResponseDTO(token, usuario));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
    }

    @GetMapping("/me")
    public ResponseEntity<Usuario> me(Authentication authentication) {
        Optional<Usuario> userDb = repository.findByEmail(authentication.getName());

        if (userDb.isPresent()) {
            Usuario user = userDb.get();
            user.setSenha(null);
            return ResponseEntity.ok(user);
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/me/telefone")
    public ResponseEntity<Usuario> updateMyPhone(@RequestBody TelefoneUpdateDTO input, Authentication authentication) {
        Optional<Usuario> userDb = repository.findByEmail(authentication.getName());

        if (userDb.isPresent()) {
            Usuario user = userDb.get();
            user.setTelefone(input.getTelefone());
            Usuario updated = repository.save(user);
            updated.setSenha(null);
            return ResponseEntity.ok(updated);
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/me")
    public ResponseEntity<Usuario> updateMyProfile(@RequestBody UserProfileUpdateDTO input, Authentication authentication) {
        Optional<Usuario> userDb = repository.findByEmail(authentication.getName());

        if (userDb.isPresent()) {
            Usuario user = userDb.get();
            user.setNomeCompleto(input.getNomeCompleto());
            user.setTelefone(input.getTelefone());
            user.setDataNascimento(input.getDataNascimento());
            Usuario updated = repository.save(user);
            updated.setSenha(null);
            return ResponseEntity.ok(updated);
        }

        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> updateByAdmin(@PathVariable Long id, @RequestBody AdminUserUpdateDTO input) {
        Optional<Usuario> userDb = repository.findById(id);

        if (userDb.isPresent()) {
            Usuario user = userDb.get();
            user.setNomeCompleto(input.getNomeCompleto());
            user.setEmail(input.getEmail());
            user.setCpf(input.getCpf());
            user.setTelefone(input.getTelefone());
            user.setDataNascimento(input.getDataNascimento());
            user.setRole(input.getRole() == null ? user.getRole() : input.getRole());

            Usuario updated = repository.save(user);
            updated.setSenha(null);
            return ResponseEntity.ok(updated);
        }

        return ResponseEntity.notFound().build();
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