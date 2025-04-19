package com.example.computersales.controller;

import com.example.computersales.model.CartItem;
import com.example.computersales.payload.request.CartRequest;
import com.example.computersales.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired CartService cartSvc;

    @GetMapping
    public List<CartItem> list(Principal p) {
        return cartSvc.list(p);
    }

    @PostMapping
    public CartItem add(Principal p,
                        @Valid @RequestBody CartRequest req) {
        return cartSvc.add(p, req.getProductId(), req.getQuantity());
    }

    @DeleteMapping("/{id}")
    public void remove(@PathVariable Long id) {
        cartSvc.remove(id);
    }
}

