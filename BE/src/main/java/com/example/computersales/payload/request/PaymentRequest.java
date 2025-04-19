package com.example.computersales.payload.request;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class PaymentRequest {
    @NotBlank private String cardNumber;
    @NotBlank private String expiry;
    @NotBlank private String cvv;
}

