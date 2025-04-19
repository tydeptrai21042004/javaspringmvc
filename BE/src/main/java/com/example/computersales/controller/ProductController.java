package com.example.computersales.controller;

import com.example.computersales.model.Product;
import com.example.computersales.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired ProductService prodSvc;

    @GetMapping
    public List<Product> all() {
        return prodSvc.listAll();
    }
    @GetMapping("/{id}")
    public Product one(@PathVariable Long id) {
        return prodSvc.get(id);
    }
}

