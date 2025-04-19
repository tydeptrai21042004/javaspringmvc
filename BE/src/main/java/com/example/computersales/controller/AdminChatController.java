// src/main/java/com/example/computersales/controller/AdminChatController.java
package com.example.computersales.controller;

import com.example.computersales.model.ChatMessage;
import com.example.computersales.payload.request.ChatMessageRequest;
import com.example.computersales.service.ChatService;
import com.example.computersales.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/chat/admin")
public class AdminChatController {

    @Autowired private ChatService    chatSvc;
    @Autowired private UserRepository userRepo;

    /** List all user IDs who’ve chatted with the admin */
    @GetMapping("/users")
    public List<Long> listUsers() {
        return chatSvc.listChatUsers();
    }

    /** Fetch 1:1 with a given user */
    @GetMapping("/{userId}")
    public List<ChatMessage> convo(@PathVariable Long userId) {
        return chatSvc.getConversationWithAdmin(userId);
    }

    /** Reply to that user */
    @PostMapping("/{userId}")
    public ChatMessage reply(
        Principal principal,
        @PathVariable Long userId,
        @RequestBody ChatMessageRequest req
    ) {
        var admin = userRepo.findByUsername(principal.getName())
            .orElseThrow(() -> new IllegalArgumentException("Unknown admin"));

        // reuse the same DTO, just override recipient
        req.setRecipientId(userId);
        return chatSvc.sendMessage(admin.getId(), req);
    }

    /** See every message in the system */
    @GetMapping("/messages")
    public List<ChatMessage> allMessages() {
        return chatSvc.getAllMessages();
    }
    public Long findAdminId() {
        return userRepo.findByRole(com.example.computersales.model.Role.ROLE_ADMIN)
            .stream().findFirst()
            .orElseThrow(() -> new IllegalStateException("No admin user found"))
            .getId();
    }
}
