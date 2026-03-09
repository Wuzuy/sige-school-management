package com.wuzuy.sejasenai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
<<<<<<< Updated upstream
=======
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;
>>>>>>> Stashed changes

@EnableMethodSecurity
@Configuration
public class SecurityConfig {

<<<<<<< Updated upstream
=======
    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private RateLimitFilter rateLimitFilter;

>>>>>>> Stashed changes
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
<<<<<<< Updated upstream
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Rotas publicas (Login e Cadastro)
                        .requestMatchers(HttpMethod.POST, "/api/usuarios/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll()

                        // Rotas exclusivas para ADMIN
=======
        http.csrf(csrf -> csrf.disable()) // Desabilitar CSRF completamente (JWT não precisa)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                // Headers de Segurança HTTP
                .headers(headers -> headers
                        .contentSecurityPolicy(csp -> csp
                                .policyDirectives("default-src 'self'; " +
                                        "script-src 'self' 'unsafe-inline'; " +
                                        "style-src 'self' 'unsafe-inline'; " +
                                        "img-src 'self' data: https:; " +
                                        "font-src 'self' data:;")
                        )
                        .xssProtection(xss -> xss.headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
                        .contentTypeOptions(options -> options.disable())
                        .frameOptions(frame -> frame.sameOrigin()) // Permitir frames para H2 Console
                        .httpStrictTransportSecurity(hsts -> hsts
                                .includeSubDomains(true)
                                .maxAgeInSeconds(31536000)
                        )
                )
                
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll() // H2 Console
                        .requestMatchers(HttpMethod.POST, "/api/usuarios/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/usuarios/setup-admin").permitAll() // Setup inicial
                        .requestMatchers(HttpMethod.GET, "/api/editais").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/password-recovery/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/password-recovery/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/usuarios/admin").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/usuarios").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/usuarios/*/role").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/usuarios/*").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").hasAuthority("ROLE_ADMIN")
>>>>>>> Stashed changes
                        .requestMatchers(HttpMethod.POST, "/api/cursos/**", "/api/unidades/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/cursos/**", "/api/unidades/**").hasAuthority("ROLE_ADMIN")

                        // Rotas para usuarios logados (USER ou ADMIN)
                        .requestMatchers("/api/inscricoes/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        // Qualquer outra requisicao precisa de autenticacao
                        .anyRequest().authenticated()
                )
<<<<<<< Updated upstream
                .httpBasic(basic -> {}); // Habilita autenticacao basica temporaria para testes
=======
                // Adiciona o filtro de rate limiting antes de tudo
                .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
                // Adiciona o filtro JWT antes do filtro de autenticacao padrao
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
>>>>>>> Stashed changes

        return http.build();
    }
}
