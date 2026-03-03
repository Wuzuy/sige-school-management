package com.wuzuy.sejasenai.repository;

import com.wuzuy.sejasenai.model.Inscricao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InscricaoRepository extends JpaRepository<Inscricao, Long> {

}
