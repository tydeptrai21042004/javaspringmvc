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
@RequestMapping("/api/chat/user")
public class ChatController {

    @Autowired private ChatService    chatSvc;
    @Autowired private UserRepository userRepo;

    /** POST /api/chat/user/send */
    @PostMapping("/send")
    public ChatMessage send(
        Principal principal,
        @RequestBody ChatMessageRequest req
    ) {
        var me = userRepo.findByUsername(principal.getName())
                         .orElseThrow(() -> new IllegalArgumentException("Unknown user"));
        // always send to single admin
        Long adminId = chatSvc.findAdminId();
        var r = new ChatMessageRequest();
        r.setRecipientId(adminId);
        r.setContent(req.getContent());
        return chatSvc.sendMessage(me.getId(), r);
    }

    /** GET /api/chat/user/with-admin */
    @GetMapping("/with-admin")
    public List<ChatMessage> withAdmin(Principal principal) {
        var me = userRepo.findByUsername(principal.getName())
                         .orElseThrow(() -> new IllegalArgumentException("Unknown user"));
        return chatSvc.getConversationWithAdmin(me.getId());
    }
}