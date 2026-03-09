package com.wuzuy.sejasenai.controller;

import com.wuzuy.sejasenai.dto.ForgotPasswordDTO;
import com.wuzuy.sejasenai.dto.ResetPasswordDTO;
import com.wuzuy.sejasenai.model.PasswordResetToken;
import com.wuzuy.sejasenai.model.Usuario;
import com.wuzuy.sejasenai.repository.PasswordResetTokenRepository;
import com.wuzuy.sejasenai.repository.UsuarioRepository;
import com.wuzuy.sejasenai.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/password-recovery")
@CrossOrigin(origins = "*")
public class PasswordRecoveryController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordDTO request) {
        Map<String, String> response = new HashMap<>();
        
        try {
            Optional<Usuario> userOpt = usuarioRepository.findByEmail(request.getEmail());
            
            if (userOpt.isEmpty()) {
                // Por segurança, não revelamos se o email existe ou não
                response.put("message", "Se o email existir, você receberá instruções para redefinir sua senha");
                return ResponseEntity.ok(response);
            }

            // Deletar tokens antigos desse email
            tokenRepository.deleteByEmail(request.getEmail());

            // Gerar novo token
            String token = UUID.randomUUID().toString();
            LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(30);

            PasswordResetToken resetToken = new PasswordResetToken(token, request.getEmail(), expiryDate);
            tokenRepository.save(resetToken);

            // Enviar email
            emailService.sendPasswordResetEmail(request.getEmail(), token);

            response.put("message", "Se o email existir, você receberá instruções para redefinir sua senha");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("error", "Erro ao processar solicitação. Tente novamente mais tarde");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordDTO request) {
        Map<String, String> response = new HashMap<>();

        try {
            Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(request.getToken());

            if (tokenOpt.isEmpty()) {
                response.put("error", "Token inválido");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            PasswordResetToken resetToken = tokenOpt.get();

            if (resetToken.isUsed()) {
                response.put("error", "Este token já foi utilizado");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            if (resetToken.isExpired()) {
                response.put("error", "Token expirado. Solicite uma nova recuperação de senha");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Buscar usuário
            Optional<Usuario> userOpt = usuarioRepository.findByEmail(resetToken.getEmail());
            if (userOpt.isEmpty()) {
                response.put("error", "Usuário não encontrado");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            Usuario user = userOpt.get();

            // Atualizar senha
            user.setSenha(encoder.encode(request.getNewPassword()));
            usuarioRepository.save(user);

            // Marcar token como usado
            resetToken.setUsed(true);
            tokenRepository.save(resetToken);

            response.put("message", "Senha redefinida com sucesso!");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("error", "Erro ao redefinir senha. Tente novamente mais tarde");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestParam String token) {
        Map<String, Object> response = new HashMap<>();

        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);

        if (tokenOpt.isEmpty()) {
            response.put("valid", false);
            response.put("error", "Token inválido");
            return ResponseEntity.ok(response);
        }

        PasswordResetToken resetToken = tokenOpt.get();

        if (resetToken.isUsed()) {
            response.put("valid", false);
            response.put("error", "Token já utilizado");
            return ResponseEntity.ok(response);
        }

        if (resetToken.isExpired()) {
            response.put("valid", false);
            response.put("error", "Token expirado");
            return ResponseEntity.ok(response);
        }

        response.put("valid", true);
        response.put("email", resetToken.getEmail());
        return ResponseEntity.ok(response);
    }
}
