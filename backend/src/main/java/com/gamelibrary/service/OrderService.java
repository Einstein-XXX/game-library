package com.gamelibrary.service;

import com.gamelibrary.model.*;
import com.gamelibrary.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ShoppingCartRepository cartRepository;
    
    @Autowired
    private GameLibraryRepository libraryRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AchievementService achievementService;
    
    @Transactional
    public Order checkout(String userId) {
        logger.info("Processing checkout for userId={}", userId);
        
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("Checkout failed: User not found - userId={}", userId);
                    return new RuntimeException("User not found");
                });
        
        List<ShoppingCart> cartItems = cartRepository.findByUserId(userId);
        logger.debug("Found {} items in cart for userId={}", cartItems.size(), userId);
        
        if (cartItems.isEmpty()) {
            logger.warn("Checkout failed: Cart is empty for userId={}", userId);
            throw new RuntimeException("Cart is empty");
        }
        
        // Create order
        Order order = new Order();
        order.setUserId(userId);
        order.setStatus("COMPLETED");
        order.setPaymentMethod("CREDIT_CARD");
        
        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        
        for (ShoppingCart cartItem : cartItems) {
            // Create order item
            OrderItem orderItem = new OrderItem();
            orderItem.setGameId(cartItem.getGameId());
            orderItem.setGameTitle(cartItem.getGameTitle());
            orderItem.setGameImageUrl(cartItem.getGameImageUrl());
            orderItem.setPrice(cartItem.getPrice());
            orderItems.add(orderItem);
            
            total = total.add(cartItem.getPrice());
            
            // Add to library (only if not already owned)
            if (!libraryRepository.existsByUserIdAndGameId(userId, cartItem.getGameId())) {
                GameLibrary library = new GameLibrary();
                library.setUserId(userId);
                library.setGameId(cartItem.getGameId());
                library.setGameTitle(cartItem.getGameTitle());
                library.setGameImageUrl(cartItem.getGameImageUrl());
                library.setPricePaid(cartItem.getPrice());
                libraryRepository.save(library);
            }
        }
        
        order.setOrderItems(orderItems);
        order.setTotalAmount(total);
        Order savedOrder = orderRepository.save(order);
        logger.info("Order created successfully: orderId={}, userId={}, totalAmount={}, itemCount={}", 
            savedOrder.getId(), userId, total, orderItems.size());
        
        // Clear cart
        cartRepository.deleteByUserId(userId);
        logger.debug("Cart cleared for userId={}", userId);
        
        // Check for achievements (don't block checkout if it fails)
        try {
            logger.debug("Checking achievements for userId={}", userId);
            achievementService.checkAndUnlockAchievements(userId);
        } catch (Exception e) {
            // Don't fail checkout if achievement check fails
            logger.warn("Achievement check failed for userId={}: {}", userId, e.getMessage(), e);
        }
        
        return savedOrder;
    }
    
    public List<Order> getUserOrders(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}

