package com.gamelibrary.service;

import com.gamelibrary.model.*;
import com.gamelibrary.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ShoppingCartRepository cartRepository;
    
    @Autowired
    private GameLibraryRepository libraryRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public Order checkout(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<ShoppingCart> cartItems = cartRepository.findByUser_UserId(userId);
        
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setStatus("COMPLETED");
        order.setPaymentMethod("CREDIT_CARD");
        
        BigDecimal total = BigDecimal.ZERO;
        
        for (ShoppingCart cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setGame(cartItem.getGame());
            orderItem.setPrice(cartItem.getGame().getPrice());
            order.getOrderItems().add(orderItem);
            
            total = total.add(cartItem.getGame().getPrice());
            
            // Add to library
            GameLibrary library = new GameLibrary();
            library.setUser(user);
            library.setGame(cartItem.getGame());
            libraryRepository.save(library);
        }
        
        order.setTotalAmount(total);
        Order savedOrder = orderRepository.save(order);
        
        // Clear cart
        cartRepository.deleteByUser_UserId(userId);
        
        return savedOrder;
    }
    
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);
    }
}

