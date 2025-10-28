package com.gamelibrary.controller;

import com.gamelibrary.dto.MessageResponse;
import com.gamelibrary.model.Order;
import com.gamelibrary.model.User;
import com.gamelibrary.repository.OrderRepository;
import com.gamelibrary.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
    
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userRepository.deleteById(id);
            return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Failed to delete user"));
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();
        return ResponseEntity.ok(new StatsResponse(totalUsers, totalOrders));
    }
    
    static class StatsResponse {
        public long totalUsers;
        public long totalOrders;
        
        public StatsResponse(long totalUsers, long totalOrders) {
            this.totalUsers = totalUsers;
            this.totalOrders = totalOrders;
        }
    }
}

