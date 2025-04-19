package com.example.computersales.payload.request;

import lombok.Data;

@Data
public class ChatMessageRequest {
    private Long recipientId;
    private String content;
}
