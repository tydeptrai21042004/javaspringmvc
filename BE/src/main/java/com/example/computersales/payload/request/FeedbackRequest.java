// src/main/java/com/example/computersales/payload/request/FeedbackRequest.java
package com.example.computersales.payload.request;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class FeedbackRequest {
  @Min(1) @Max(5)
  private Integer rating;
  @NotBlank
  private String comment;
}
