package com.gamelibrary.service;

import com.gamelibrary.model.Game;
import com.gamelibrary.model.ShoppingCart;
import com.gamelibrary.model.User;
import com.gamelibrary.repository.GameRepository;
import com.gamelibrary.repository.ShoppingCartRepository;
import com.gamelibrary.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {
    
    @Autowired
    private ShoppingCartRepository cartRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private GameRepository gameRepository;
    
    public List<ShoppingCart> getUserCart(Long userId) {
        return cartRepository.findByUser_UserId(userId);
    }
    
    public ShoppingCart addToCart(Long userId, Long gameId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        
        ShoppingCart cart = new ShoppingCart();
        cart.setUser(user);
        cart.setGame(game);
        
        return cartRepository.save(cart);
    }
    
    @Transactional
    public void removeFromCart(Long userId, Long gameId) {
        cartRepository.deleteByUser_UserIdAndGame_GameId(userId, gameId);
    }
    
    @Transactional
    public void clearCart(Long userId) {
        cartRepository.deleteByUser_UserId(userId);
    }
}

