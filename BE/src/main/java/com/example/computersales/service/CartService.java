package com.example.computersales.service;

import com.example.computersales.model.*;
import com.example.computersales.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
public class CartService {
    @Autowired CartItemRepository cartRepo;
    @Autowired UserRepository userRepo;
    @Autowired ProductRepository prodRepo;

    public List<CartItem> list(Principal principal) {
        User u = userRepo.findByUsername(principal.getName()).orElseThrow();
        return cartRepo.findByUser(u);
    }

    public CartItem add(Principal principal, Long prodId, int qty) {
        User u = userRepo.findByUsername(principal.getName()).orElseThrow();
        Product p = prodRepo.findById(prodId).orElseThrow();
        CartItem item = new CartItem();
        item.setUser(u);
        item.setProduct(p);
        item.setQuantity(qty);
        return cartRepo.save(item);
    }

    public void remove(Long id) {
        cartRepo.deleteById(id);
    }

    public void clear(Principal principal) {
        User u = userRepo.findByUsername(principal.getName()).orElseThrow();
        cartRepo.deleteByUser(u);
    }
}

