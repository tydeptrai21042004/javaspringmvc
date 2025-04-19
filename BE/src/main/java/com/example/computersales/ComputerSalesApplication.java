// src/main/java/com/example/computersales/ComputerSalesApplication.java
package com.example.computersales;

import com.example.computersales.model.Brand;
import com.example.computersales.model.Category;
import com.example.computersales.model.Product;
import com.example.computersales.model.Role;
import com.example.computersales.model.User;
import com.example.computersales.repository.UserRepository;
import com.example.computersales.service.BrandService;
import com.example.computersales.service.CategoryService;
import com.example.computersales.service.ProductService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;

@SpringBootApplication
public class ComputerSalesApplication {

    public static void main(String[] args) {
        SpringApplication.run(ComputerSalesApplication.class, args);
    }

    /**
     * Seed an admin user on startup if one does not already exist.
     */
    @Bean
    public CommandLineRunner initAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@example.com");
                // default registrationTime is set in the entity
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ROLE_ADMIN);
                userRepository.save(admin);
            }
        };
    }

    /**
     * Seed some sample categories, brands, and products if none exist yet.
     */
    @Bean
    public CommandLineRunner initSampleData(
            CategoryService categoryService,
            BrandService brandService,
            ProductService productService
    ) {
        return args -> {
            if (categoryService.listAll().isEmpty()) {
                // --- categories ---
                Category laptops = new Category();
                laptops.setName("Laptops");
                categoryService.save(laptops);

                Category desktops = new Category();
                desktops.setName("Desktops");
                categoryService.save(desktops);

                Category monitors = new Category();
                monitors.setName("Monitors");
                categoryService.save(monitors);

                // --- brands ---
                Brand dell = new Brand();
                dell.setName("Dell");
                brandService.save(dell);

                Brand hp = new Brand();
                hp.setName("HP");
                brandService.save(hp);

                Brand apple = new Brand();
                apple.setName("Apple");
                brandService.save(apple);

                // --- products ---
                Product p1 = new Product();
                p1.setName("XPS 13");
                p1.setDescription("Dell XPS 13 ultrabook");
                p1.setPrice(1099.99);
                p1.setCategory(laptops);
                p1.setBrand(dell);
                p1.setImageUrls(Collections.emptyList());
                productService.save(p1);

                Product p2 = new Product();
                p2.setName("Pavilion Desktop");
                p2.setDescription("HP Pavilion all-in-one");
                p2.setPrice(799.00);
                p2.setCategory(desktops);
                p2.setBrand(hp);
                p2.setImageUrls(Collections.emptyList());
                productService.save(p2);

                Product p3 = new Product();
                p3.setName("MacBook Pro");
                p3.setDescription("Apple MacBook Pro 14-inch");
                p3.setPrice(1999.00);
                p3.setCategory(laptops);
                p3.setBrand(apple);
                p3.setImageUrls(Collections.emptyList());
                productService.save(p3);

                Product p4 = new Product();
                p4.setName("UltraSharp Monitor");
                p4.setDescription("Dell UltraSharp 27\" QHD");
                p4.setPrice(399.99);
                p4.setCategory(monitors);
                p4.setBrand(dell);
                p4.setImageUrls(Collections.emptyList());
                productService.save(p4);
            }
        };
    }
}
