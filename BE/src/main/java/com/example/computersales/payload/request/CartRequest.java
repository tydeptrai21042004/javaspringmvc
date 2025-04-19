package com.example.computersales.payload.request;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class CartRequest {
    @NotNull private Long productId;
    @Min(1) private int quantity;
}

