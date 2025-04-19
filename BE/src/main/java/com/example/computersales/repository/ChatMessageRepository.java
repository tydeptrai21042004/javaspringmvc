// src/main/java/com/example/computersales/repository/ChatMessageRepository.java
package com.example.computersales.repository;

import com.example.computersales.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findBySenderIdAndRecipientIdOrSenderIdAndRecipientIdOrderBySentAtAsc(
        Long sender1, Long recipient1,
        Long sender2, Long recipient2
    );

    @Query("""
      SELECT DISTINCT CASE 
        WHEN m.sender.id = :adminId THEN m.recipient.id 
        ELSE m.sender.id 
      END
      FROM ChatMessage m
      WHERE m.sender.id = :adminId OR m.recipient.id = :adminId
    """)
    List<Long> findDistinctUserIds(@Param("adminId") Long adminId);
}
