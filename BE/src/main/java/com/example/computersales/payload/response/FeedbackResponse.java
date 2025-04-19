// src/main/java/com/example/computersales/payload/response/FeedbackResponse.java
package com.example.computersales.payload.response;

import lombok.*;
import java.util.Date;

@Data
@AllArgsConstructor
public class FeedbackResponse {
  private Long id;
  private String username;
  private Integer rating;
  private String comment;
  private Date createdAt;
}
