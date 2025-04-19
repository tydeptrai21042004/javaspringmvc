// src/main/java/com/example/computersales/model/Feedback.java
package com.example.computersales.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  private User user;

  @ManyToOne(optional = false)
  private Product product;

  private Integer rating;

  @Column(length = 1000)
  private String comment;

  private Date createdAt = new Date();
}
