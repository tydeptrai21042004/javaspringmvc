// src/main/java/com/example/computersales/service/UserService.java
package com.example.computersales.service;

import com.example.computersales.model.User;
import com.example.computersales.model.Role;
import com.example.computersales.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired 
    private UserRepository userRepo;

    @Autowired 
    private PasswordEncoder encoder;

    /**
     * Register a new normal user.
     */
    public User register(String username, String email, String rawPass) {
        User u = new User();
        u.setUsername(username);
        u.setEmail(email);
        u.setPassword(encoder.encode(rawPass));
        u.setRole(Role.ROLE_USER);
        // banned is false by default
        return userRepo.save(u);
    }

    /**
     * List all users (for admin dashboard).
     */
    public List<User> listAll() {
        return userRepo.findAll();
    }

    /**
     * Mark the given user as banned.
     */
    public void banUser(Long id) {
        User u = userRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found: " + id));
        u.setBanned(true);
        userRepo.save(u);
    }
}
