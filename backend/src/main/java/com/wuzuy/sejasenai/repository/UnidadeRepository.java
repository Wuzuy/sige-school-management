package com.wuzuy.sejasenai.repository;

import com.wuzuy.sejasenai.model.Unidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UnidadeRepository extends JpaRepository<Unidade, Long> {

}
