package com.example.computersales.service;

import com.example.computersales.model.*;
import com.example.computersales.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
public class PaymentService {
    @Autowired OrderRepository orderRepo;
    @Autowired CartService cartService;
    @Autowired CartItemRepository cartRepo;
    @Autowired UserRepository userRepo;
    @Autowired ProductRepository prodRepo;

    public Order pay(Principal principal) {
        User u = userRepo.findByUsername(principal.getName()).orElseThrow();
        List<CartItem> items = cartRepo.findByUser(u);
        double total = items.stream()
            .mapToDouble(i -> i.getProduct().getPrice() * i.getQuantity())
            .sum();

        Order o = new Order();
        o.setUser(u);
        o.setTotal(total);
        Order saved = orderRepo.save(o);

        // clear cart
        cartRepo.deleteByUser(u);
        return saved;
    }
}

