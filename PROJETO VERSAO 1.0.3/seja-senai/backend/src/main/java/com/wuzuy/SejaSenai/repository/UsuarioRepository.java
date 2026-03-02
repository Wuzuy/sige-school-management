package com.wuzuy.sejasenai.repository;

import com.wuzuy.sejasenai.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByCpf(String cpf);

    Optional<Usuario> findByEmail(String email);
}
