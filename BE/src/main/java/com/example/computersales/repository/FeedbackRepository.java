// src/main/java/com/example/computersales/repository/FeedbackRepository.java
package com.example.computersales.repository;

import com.example.computersales.model.Feedback;
import com.example.computersales.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback,Long> {
  List<Feedback> findByProduct(Product product);
}
