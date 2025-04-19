// src/main/java/com/example/computersales/service/CategoryService.java
package com.example.computersales.service;

import com.example.computersales.model.Category;
import com.example.computersales.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository repo;

    public List<Category> listAll() {
        return repo.findAll();
    }

    public Category save(Category c) {
        return repo.save(c);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public Category findById(Long id) {
        return repo.findById(id)
                   .orElseThrow(() -> new IllegalArgumentException("Invalid category ID: " + id));
    }
}
