package com.example.computersales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.computersales.model.CartItem;
import com.example.computersales.model.User;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem,Long> {
    List<CartItem> findByUser(User user);
    void deleteByUser(User user);
}

