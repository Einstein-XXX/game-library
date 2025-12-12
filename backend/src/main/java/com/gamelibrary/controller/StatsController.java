package com.gamelibrary.controller;

import com.gamelibrary.model.Order;
import com.gamelibrary.repository.GameLibraryRepository;
import com.gamelibrary.repository.OrderRepository;
import com.gamelibrary.repository.ReviewRepository;
import com.gamelibrary.repository.WishlistRepository;
import com.gamelibrary.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/stats")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StatsController {
    
    @Autowired
    private GameLibraryRepository libraryRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private WishlistRepository wishlistRepository;
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @GetMapping("/user")
    public ResponseEntity<?> getUserStats(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        
        long gamesOwned = libraryRepository.countByUserId(userId);
        long wishlistCount = wishlistRepository.findByUserId(userId).size();
        long reviewsCount = reviewRepository.findByUserId(userId).size();
        
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        double totalSpent = orders.stream()
                .mapToDouble(o -> o.getTotalAmount().doubleValue())
                .sum();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("gamesOwned", gamesOwned);
        stats.put("wishlistCount", wishlistCount);
        stats.put("reviewsCount", reviewsCount);
        stats.put("totalSpent", totalSpent);
        stats.put("totalOrders", orders.size());
        
        return ResponseEntity.ok(stats);
    }
}

