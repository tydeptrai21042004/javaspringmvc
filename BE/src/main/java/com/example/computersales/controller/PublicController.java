package com.example.computersales.controller;

import com.example.computersales.model.Brand;
import com.example.computersales.model.Category;
import com.example.computersales.service.BrandService;
import com.example.computersales.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PublicController {

    @Autowired
    private CategoryService catSvc;

    @Autowired
    private BrandService brSvc;

    @GetMapping("/categories")
    public List<Category> categories() {
        return catSvc.listAll();
    }

    @GetMapping("/brands")
    public List<Brand> brands() {
        return brSvc.listAll();
    }
}
