package com.example.computersales.controller;

import com.example.computersales.model.Order;
import com.example.computersales.payload.request.PaymentRequest;
import com.example.computersales.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    @Autowired PaymentService paySvc;

    @PostMapping
    public Order pay(Principal p, @Valid @RequestBody PaymentRequest req) {
        // here you’d validate card info; we just simulate:
        return paySvc.pay(p);
    }
}

