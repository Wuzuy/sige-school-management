package com.wuzuy.sejasenai.repository;

import com.wuzuy.sejasenai.model.Edital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EditalRepository extends JpaRepository<Edital, Long> {
}
