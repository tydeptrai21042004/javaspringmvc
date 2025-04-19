// src/main/java/com/example/computersales/controller/AdminUserController.java
package com.example.computersales.controller;

import com.example.computersales.model.User;
import com.example.computersales.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    @Autowired
    private UserService userSvc;

    /** GET /api/admin/users — list all users */
    @GetMapping
    public List<User> listUsers() {
        return userSvc.listAll();
    }

    /** POST /api/admin/users/{id}/ban — ban a user */
    @PostMapping("/{id}/ban")
    public void banUser(@PathVariable Long id) {
        userSvc.banUser(id);
    }
}
