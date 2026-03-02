package com.wuzuy.sejasenai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@EnableMethodSecurity
@Configuration
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Rotas publicas (Login e Cadastro)
                        .requestMatchers(HttpMethod.POST, "/api/usuarios/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll()

                        // Rotas exclusivas para ADMIN
                        .requestMatchers(HttpMethod.POST, "/api/cursos/**", "/api/unidades/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/cursos/**", "/api/unidades/**").hasAuthority("ROLE_ADMIN")

                        // Rotas para usuarios logados (USER ou ADMIN)
                        .requestMatchers("/api/inscricoes/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        // Qualquer outra requisicao precisa de autenticacao
                        .anyRequest().authenticated()
                )
                .httpBasic(basic -> {}); // Habilita autenticacao basica temporaria para testes

        return http.build();
    }
}