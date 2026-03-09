package com.wuzuy.sejasenai.repository;

import com.wuzuy.sejasenai.model.Edital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EditalRepository extends JpaRepository<Edital, Long> {
    
    List<Edital> findByAtivo(Boolean ativo);
    
    List<Edital> findByAtivoOrderByIdDesc(Boolean ativo);
}
