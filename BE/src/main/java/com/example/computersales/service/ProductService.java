package com.example.computersales.service;

import com.example.computersales.model.Product;
import com.example.computersales.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepo;

    public List<Product> listAll() {
        return productRepo.findAll();
    }

    public Product get(Long id) {
        return productRepo.findById(id)
                          .orElseThrow();
    }

    public Product save(Product p) {
        return productRepo.save(p);
    }

    public void delete(Long id) {
        productRepo.deleteById(id);
    }

    // NEW: bulk-save support
    public List<Product> saveAll(List<Product> products) {
        return productRepo.saveAll(products);
    }
}
