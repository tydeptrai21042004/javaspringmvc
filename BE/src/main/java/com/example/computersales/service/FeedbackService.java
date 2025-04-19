// src/main/java/com/example/computersales/service/FeedbackService.java
package com.example.computersales.service;

import com.example.computersales.model.*;
import com.example.computersales.payload.request.FeedbackRequest;
import com.example.computersales.payload.response.FeedbackResponse;
import com.example.computersales.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {
  @Autowired FeedbackRepository feedbackRepo;
  @Autowired ProductRepository productRepo;
  @Autowired UserRepository userRepo;

  public FeedbackResponse addFeedback(Long productId, FeedbackRequest req, Principal principal) {
    User user = userRepo.findByUsername(principal.getName()).orElseThrow();
    Product product = productRepo.findById(productId).orElseThrow();
    Feedback fb = new Feedback(null, user, product, req.getRating(), req.getComment(), new java.util.Date());
    Feedback saved = feedbackRepo.save(fb);
    return new FeedbackResponse(saved.getId(), user.getUsername(), saved.getRating(), saved.getComment(), saved.getCreatedAt());
  }

  public List<FeedbackResponse> getFeedbacks(Long productId) {
    Product product = productRepo.findById(productId).orElseThrow();
    return feedbackRepo.findByProduct(product).stream()
      .map(fb -> new FeedbackResponse(fb.getId(), fb.getUser().getUsername(), fb.getRating(), fb.getComment(), fb.getCreatedAt()))
      .collect(Collectors.toList());
  }
}
