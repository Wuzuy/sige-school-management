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
    public Usuario save(@RequestBody java.util.Map<String, Object> payload) {
        // monta o Usuario a partir do payload recebido
        Usuario usuario = new Usuario();

        // nomeCompleto pode vir com a chave "nomeCompleto" ou "nome"
        Object nomeObj = payload.get("nomeCompleto");
        if (nomeObj == null) nomeObj = payload.get("nome");
        if (nomeObj != null) usuario.setNomeCompleto(nomeObj.toString());

        Object emailObj = payload.get("email");
        if (emailObj != null) usuario.setEmail(emailObj.toString());

        Object senhaObj = payload.get("senha");
        if (senhaObj != null) usuario.setSenha(senhaObj.toString());

        // campos opcionais (cpf, telefone, dataNascimento) se vierem
        Object cpfObj = payload.get("cpf");
        if (cpfObj != null) usuario.setCpf(cpfObj.toString());

        Object telefoneObj = payload.get("telefone");
        if (telefoneObj != null) usuario.setTelefone(telefoneObj.toString());

        Object dataNascObj = payload.get("dataNascimento");
        if (dataNascObj != null) {
            try {
                // tenta parsear como String yyyy-MM-dd
                java.time.LocalDate d = java.time.LocalDate.parse(dataNascObj.toString());
                usuario.setDataNascimento(d);
            } catch (Exception ignored) {
            }
        }

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
            usuario.setNomeCompleto(usuarioDb.get().getNomeCompleto());
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha inválidos");
        }
    }
}
