// src/main/java/com/example/computersales/service/BrandService.java
package com.example.computersales.service;

import com.example.computersales.model.Brand;
import com.example.computersales.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BrandService {

    @Autowired
    private BrandRepository repo;

    public List<Brand> listAll() {
        return repo.findAll();
    }

    public Brand save(Brand b) {
        return repo.save(b);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public Brand findById(Long id) {
        return repo.findById(id)
                   .orElseThrow(() -> new IllegalArgumentException("Invalid brand ID: " + id));
    }
}
