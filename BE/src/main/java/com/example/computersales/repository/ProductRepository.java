package com.example.computersales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.computersales.model.Product;

public interface ProductRepository extends JpaRepository<Product,Long> { }

