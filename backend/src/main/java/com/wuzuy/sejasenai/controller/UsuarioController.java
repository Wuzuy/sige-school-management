package com.wuzuy.sejasenai.controller;

<<<<<<< Updated upstream
=======
import com.wuzuy.sejasenai.config.JwtService;
import com.wuzuy.sejasenai.config.LoginAttemptService;
import com.wuzuy.sejasenai.config.PasswordValidator;
import com.wuzuy.sejasenai.dto.AdminUserCreateDTO;
import com.wuzuy.sejasenai.dto.AdminUserUpdateDTO;
>>>>>>> Stashed changes
import com.wuzuy.sejasenai.model.Role;
import com.wuzuy.sejasenai.model.Usuario;
import com.wuzuy.sejasenai.repository.UsuarioRepository;
import com.wuzuy.sejasenai.dto.LoginDTO;
<<<<<<< Updated upstream
=======
import com.wuzuy.sejasenai.dto.LoginResponseDTO;
import com.wuzuy.sejasenai.dto.TelefoneUpdateDTO;
import com.wuzuy.sejasenai.dto.UserProfileUpdateDTO;
import jakarta.servlet.http.HttpServletRequest;
>>>>>>> Stashed changes
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private BCryptPasswordEncoder encoder;

<<<<<<< Updated upstream
=======
    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordValidator passwordValidator;

    @Autowired
    private LoginAttemptService loginAttemptService;

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
>>>>>>> Stashed changes
    @GetMapping
    public List<Usuario> list() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<Object> register(@RequestBody Usuario user) {
        try {
            // Validação de senha forte
            if (!passwordValidator.isValid(user.getSenha())) {
                Map<String, String> erro = new HashMap<>();
                erro.put("erro", passwordValidator.getRequirements());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
            }

            user.setSenha(encoder.encode(user.getSenha()));
            Usuario salvo = repository.save(user);
<<<<<<< Updated upstream
=======
            salvo.setSenha(null);
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
        } catch (Exception e) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Erro ao criar usuário. Verifique os dados informados.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }
    }

    /**
     * Endpoint especial para criar o PRIMEIRO administrador do sistema.
     * Só funciona se não existir nenhum admin ainda (setup inicial).
     * Não requer autenticação para permitir bootstrap do sistema.
     */
    @PostMapping("/setup-admin")
    public ResponseEntity<Object> setupAdmin(@RequestBody Usuario user) {
        try {
            // Verifica se já existe algum admin no sistema
            List<Usuario> admins = repository.findAll().stream()
                    .filter(u -> u.getRole() == Role.ROLE_ADMIN)
                    .toList();

            if (!admins.isEmpty()) {
                Map<String, String> erro = new HashMap<>();
                erro.put("erro", "Setup inicial já foi realizado. Use /api/usuarios/admin para criar novos administradores.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(erro);
            }

            // Validação de senha forte
            if (!passwordValidator.isValid(user.getSenha())) {
                Map<String, String> erro = new HashMap<>();
                erro.put("erro", passwordValidator.getRequirements());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
            }

            user.setSenha(encoder.encode(user.getSenha()));
            user.setRole(Role.ROLE_ADMIN);
            Usuario salvo = repository.save(user);
            salvo.setSenha(null);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Administrador inicial criado com sucesso!");
            response.put("user", salvo);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Erro ao criar administrador. Verifique os dados informados: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/admin")
    public ResponseEntity<Object> registerByAdmin(@RequestBody AdminUserCreateDTO input) {
        try {
            // Validação de senha forte
            if (!passwordValidator.isValid(input.getSenha())) {
                Map<String, String> erro = new HashMap<>();
                erro.put("erro", passwordValidator.getRequirements());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
            }

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
>>>>>>> Stashed changes
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
        } catch (Exception e) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Erro ao criar usuário. Verifique os dados informados.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginDTO login, HttpServletRequest request) {
        String ip = getClientIP(request);
        String key = login.getEmail() + "_" + ip;

        // Verifica se o usuário está bloqueado
        if (loginAttemptService.isBlocked(key)) {
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "Conta temporariamente bloqueada por muitas tentativas de login.");
            erro.put("tempoRestante", loginAttemptService.getRemainingLockTime(key) + " minutos");
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(erro);
        }

        Optional<Usuario> userDb = repository.findByEmail(login.getEmail());

        if (userDb.isPresent() && encoder.matches(login.getSenha(), userDb.get().getSenha())) {
<<<<<<< Updated upstream
            userDb.get().setSenha(null);
            return ResponseEntity.ok(userDb.get());
=======
            loginAttemptService.loginSucceeded(key);
            Usuario usuario = userDb.get();
            String token = jwtService.generateToken(usuario.getEmail());
            usuario.setSenha(null);
            return ResponseEntity.ok(new LoginResponseDTO(token, usuario));
>>>>>>> Stashed changes
        }

        // Registra tentativa falhada
        loginAttemptService.loginFailed(key);
        int remaining = loginAttemptService.getRemainingAttempts(key);
        
        Map<String, Object> erro = new HashMap<>();
        erro.put("erro", "Credenciais inválidas");
        if (remaining > 0) {
            erro.put("tentativasRestantes", remaining);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(erro);
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

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
