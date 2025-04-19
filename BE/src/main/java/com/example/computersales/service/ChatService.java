package com.example.computersales.service;

import com.example.computersales.model.ChatMessage;
import com.example.computersales.model.User;
import com.example.computersales.payload.request.ChatMessageRequest;
import com.example.computersales.repository.ChatMessageRepository;
import com.example.computersales.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    @Autowired private ChatMessageRepository chatRepo;
    @Autowired private UserRepository        userRepo;

    public ChatMessage sendMessage(Long senderId, ChatMessageRequest req) {
        User sender = userRepo.findById(senderId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid sender ID"));
        User recipient = userRepo.findById(req.getRecipientId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid recipient ID"));
        ChatMessage m = ChatMessage.builder()
            .sender(sender)
            .recipient(recipient)
            .content(req.getContent())
            .sentAt(LocalDateTime.now())
            .build();
        return chatRepo.save(m);
    }

    public List<ChatMessage> getConversation(Long a, Long b) {
        return chatRepo.findBySenderIdAndRecipientIdOrSenderIdAndRecipientIdOrderBySentAtAsc(
            a, b, b, a
        );
    }

    public List<ChatMessage> getConversationWithAdmin(Long userId) {
        Long adminId = findAdminId();
        return getConversation(userId, adminId);
    }

    public List<Long> listChatUsers() {
        return chatRepo.findDistinctUserIds(findAdminId());
    }

    public List<ChatMessage> getAllMessages() {
        return chatRepo.findAll();
    }

    public Long findAdminId() {
        return userRepo.findByRole(com.example.computersales.model.Role.ROLE_ADMIN)
            .stream().findFirst()
            .orElseThrow(() -> new IllegalStateException("No admin user found"))
            .getId();
    }
}