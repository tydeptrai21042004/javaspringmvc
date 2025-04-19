package com.example.computersales.payload.response;

import lombok.*;

@Data @AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String role;
}

