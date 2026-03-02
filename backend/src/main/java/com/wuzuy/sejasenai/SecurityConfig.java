package com.wuzuy.sejasenai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
<<<<<<< yago
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    // Define o encriptador de senhas como um Bean para ser usado no Controller
=======
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@EnableMethodSecurity
@Configuration
public class SecurityConfig {

>>>>>>> main
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

<<<<<<< yago
    // Configura as rotas para permitir acesso sem autenticacao por enquanto
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
<<<<<<< Updated upstream
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
=======
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Permite a pré-verificação do navegador (CORS)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/usuarios/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/cursos/**", "/api/unidades/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/cursos/**", "/api/unidades/**").hasAuthority("ROLE_ADMIN")

                        .requestMatchers("/api/inscricoes/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        .anyRequest().authenticated()
                )
                .httpBasic(basic -> {});

>>>>>>> Stashed changes
=======
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

>>>>>>> main
        return http.build();
    }
}