package com.example.computersales.payload.request;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class SignupRequest {
    @NotBlank private String username;
    @NotBlank @Email private String email;
    @NotBlank @Size(min=6) private String password;
}

