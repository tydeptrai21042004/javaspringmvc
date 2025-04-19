// src/main/java/com/example/computersales/dto/ChatMessageDto.java
package com.example.computersales.dto;

import java.time.LocalDateTime;

public record ChatMessageDto(
    Long id,
    Long senderId,
    String senderName,
    Long recipientId,
    String content,
    LocalDateTime sentAt
) {}
