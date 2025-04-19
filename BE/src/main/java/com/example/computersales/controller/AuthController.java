package com.example.computersales.controller;

import com.example.computersales.config.JwtUtils;
import com.example.computersales.model.User;
import com.example.computersales.payload.request.*;
import com.example.computersales.payload.response.*;
import com.example.computersales.repository.UserRepository;
import com.example.computersales.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired AuthenticationManager authManager;
    @Autowired JwtUtils jwtUtils;
    @Autowired UserRepository userRepo;
    @Autowired UserService userSvc;

    @PostMapping("/login")
    public JwtResponse login(@Valid @RequestBody LoginRequest req) {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        User u = userRepo.findByUsername(req.getUsername()).orElseThrow();
        String token = jwtUtils.generateJwtToken(u.getUsername(), u.getRole().name());

        return new JwtResponse(token, "Bearer", u.getUsername(), u.getRole().name());
    }

    @PostMapping("/register")
    public MessageResponse register(@Valid @RequestBody SignupRequest req) {
        if (userRepo.existsByUsername(req.getUsername())) {
            return new MessageResponse("Error: Username is already taken!");
        }
        if (userRepo.existsByEmail(req.getEmail())) {
            return new MessageResponse("Error: Email is already in use!");
        }
        userSvc.register(req.getUsername(), req.getEmail(), req.getPassword());
        return new MessageResponse("User registered successfully!");
    }
}

