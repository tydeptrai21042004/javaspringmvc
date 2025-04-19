// src/main/java/com/example/computersales/controller/AdminController.java
package com.example.computersales.controller;

import com.example.computersales.model.Brand;
import com.example.computersales.model.Category;
import com.example.computersales.model.Product;
import com.example.computersales.model.Order;
import com.example.computersales.payload.response.DailyCount;
import com.example.computersales.payload.response.StatsResponse;
import com.example.computersales.repository.OrderRepository;
import com.example.computersales.repository.UserRepository;
import com.example.computersales.service.BrandService;
import com.example.computersales.service.CategoryService;
import com.example.computersales.service.FileStorageService;
import com.example.computersales.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private UserRepository    userRepo;
    @Autowired private ProductService    prodSvc;
    @Autowired private OrderRepository   orderRepo;
    @Autowired private FileStorageService storageSvc;
    @Autowired private CategoryService   catSvc;
    @Autowired private BrandService      brSvc;

    @GetMapping("/stats")
    public StatsResponse stats() {
        long totalUsers    = userRepo.count();
        long totalProducts = prodSvc.listAll().size();
        double totalSales  = orderRepo.findAll()
                                      .stream()
                                      .mapToDouble(Order::getTotal)
                                      .sum();

        List<DailyCount> newUsers    = userRepo.countNewUsersLast7Days();
        List<DailyCount> newPayments = orderRepo.countNewPaymentsLast7Days();

        return new StatsResponse(
            totalUsers,
            totalSales,
            totalProducts,
            newUsers,
            newPayments
        );
    }

    @GetMapping("/products")
    public List<Product> listProducts() {
        return prodSvc.listAll();
    }

    @GetMapping("/categories")
    public List<Category> listCategories() {
        return catSvc.listAll();
    }

    @GetMapping("/brands")
    public List<Brand> listBrands() {
        return brSvc.listAll();
    }

    @PostMapping(
      path = "/products",
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Product addProduct(
        @RequestParam("name")        String name,
        @RequestParam("price")       Double price,
        @RequestParam("description") String description,
        @RequestParam("categoryId")  Long categoryId,
        @RequestParam("brandId")     Long brandId,
        @RequestParam("images")      List<MultipartFile> images
    ) throws IOException {
        if (images.size() > 5) throw new IllegalArgumentException("Up to 5 images only");

        Category cat = catSvc.findById(categoryId);
        Brand    br  = brSvc.findById(brandId);
        List<String> urls = storageSvc.storeAll(images);

        Product p = new Product();
        p.setName(name);
        p.setPrice(price);
        p.setDescription(description);
        p.setCategory(cat);
        p.setBrand(br);
        p.setImageUrls(urls);

        return prodSvc.save(p);
    }

    @PostMapping("/products/bulk")
    public List<Product> bulkImport(@RequestBody List<Product> list) {
        return prodSvc.saveAll(list);
    }
}
