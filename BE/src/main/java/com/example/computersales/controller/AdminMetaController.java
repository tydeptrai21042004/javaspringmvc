// src/main/java/com/example/computersales/controller/AdminMetaController.java
package com.example.computersales.controller;

import com.example.computersales.model.Brand;
import com.example.computersales.model.Category;
import com.example.computersales.service.BrandService;
import com.example.computersales.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/meta")        // ← changed from "/api/admin"
public class AdminMetaController {

    @Autowired private CategoryService catSvc;
    @Autowired private BrandService    brSvc;

    // --- Categories CRUD ---
    @GetMapping("/categories")
    public List<Category> listCategories() {
        return catSvc.listAll();
    }

    @PostMapping("/categories")
    public Category addCategory(@RequestBody Category c) {
        return catSvc.save(c);
    }

    @DeleteMapping("/categories/{id}")
    public void deleteCategory(@PathVariable Long id) {
        catSvc.delete(id);
    }

    // --- Brands CRUD ---
    @GetMapping("/brands")
    public List<Brand> listBrands() {
        return brSvc.listAll();
    }

    @PostMapping("/brands")
    public Brand addBrand(@RequestBody Brand b) {
        return brSvc.save(b);
    }

    @DeleteMapping("/brands/{id}")
    public void deleteBrand(@PathVariable Long id) {
        brSvc.delete(id);
    }
}
