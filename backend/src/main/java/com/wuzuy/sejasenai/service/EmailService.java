package com.wuzuy.sejasenai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        String resetLink = frontendUrl + "/reset-password.html?token=" + resetToken;
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("SEJA SENAI - Recuperação de Senha");
        message.setText(
            "Olá,\n\n" +
            "Você solicitou a recuperação de senha do sistema SEJA SENAI.\n\n" +
            "Clique no link abaixo para redefinir sua senha:\n" +
            resetLink + "\n\n" +
            "Este link é válido por 30 minutos.\n\n" +
            "Se você não solicitou esta recuperação, ignore este email.\n\n" +
            "Atenciosamente,\n" +
            "Equipe SEJA SENAI"
        );
        
        mailSender.send(message);
    }
}
