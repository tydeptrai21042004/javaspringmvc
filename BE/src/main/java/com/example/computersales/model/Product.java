// src/main/java/com/example/computersales/model/Product.java
package com.example.computersales.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double price;

    @Column(length = 1000)
    private String description;

    @ElementCollection
    @CollectionTable(
        name = "product_images",
        joinColumns = @JoinColumn(name = "product_id")
    )
    @Column(name = "image_url", nullable = false)
    private List<String> imageUrls;

    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(optional = false)
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;
}
