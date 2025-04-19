// src/main/java/com/example/computersales/controller/FeedbackController.java
package com.example.computersales.controller;

import com.example.computersales.payload.request.FeedbackRequest;
import com.example.computersales.payload.response.FeedbackResponse;
import com.example.computersales.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/feedback")
public class FeedbackController {
  @Autowired FeedbackService feedbackSvc;

  @GetMapping
  public List<FeedbackResponse> getAll(@PathVariable Long productId) {
    return feedbackSvc.getFeedbacks(productId);
  }

  @PostMapping
  public FeedbackResponse add(@PathVariable Long productId,
                              @Valid @RequestBody FeedbackRequest req,
                              Principal principal) {
    return feedbackSvc.addFeedback(productId, req, principal);
  }
}
