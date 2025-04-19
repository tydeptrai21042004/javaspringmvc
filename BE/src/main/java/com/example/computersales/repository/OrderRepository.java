// src/main/java/com/example/computersales/repository/OrderRepository.java
package com.example.computersales.repository;

import com.example.computersales.model.Order;
import com.example.computersales.payload.response.DailyCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Long> {
    @Query("""
      SELECT new com.example.computersales.payload.response.DailyCount(
        FUNCTION('DATE', o.createdAt),
        COUNT(o)
      )
      FROM Order o
      WHERE o.createdAt >= CURRENT_DATE - 7
      GROUP BY FUNCTION('DATE', o.createdAt)
      ORDER BY FUNCTION('DATE', o.createdAt)
    """)
    List<DailyCount> countNewPaymentsLast7Days();
}
