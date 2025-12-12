package com.gamelibrary.controller;

import com.gamelibrary.dto.MessageResponse;
import com.gamelibrary.model.Order;
import com.gamelibrary.security.UserDetailsImpl;
import com.gamelibrary.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderController {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            logger.info("Starting checkout process for userId={}", userDetails.getId());
            Order order = orderService.checkout(userDetails.getId());
            logger.info("Checkout successful: userId={}, orderId={}, totalAmount={}", 
                userDetails.getId(), order.getId(), order.getTotalAmount());
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            logger.error("Checkout failed (RuntimeException): userId={}, error={}", 
                authentication != null ? ((UserDetailsImpl) authentication.getPrincipal()).getId() : "unknown", 
                e.getMessage(), e);
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Checkout failed (UnexpectedException): userId={}", 
                authentication != null ? ((UserDetailsImpl) authentication.getPrincipal()).getId() : "unknown", e);
            return ResponseEntity.internalServerError().body(new MessageResponse("Checkout failed: " + e.getMessage()));
        }
    }
    
    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        logger.debug("Fetching orders for userId={}", userDetails.getId());
        return ResponseEntity.ok(orderService.getUserOrders(userDetails.getId()));
    }
}

