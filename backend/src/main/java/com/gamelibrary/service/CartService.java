package com.gamelibrary.service;

import com.gamelibrary.model.Game;
import com.gamelibrary.model.ShoppingCart;
import com.gamelibrary.repository.GameRepository;
import com.gamelibrary.repository.ShoppingCartRepository;
import com.gamelibrary.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartService {
    
    private static final Logger logger = LoggerFactory.getLogger(CartService.class);
    
    @Autowired
    private ShoppingCartRepository cartRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private GameRepository gameRepository;
    
    public List<ShoppingCart> getUserCart(String userId) {
        return cartRepository.findByUserId(userId);
    }
    
    public ShoppingCart addToCart(String userId, Long gameId, Game gameData) {
        logger.debug("Adding game to cart: userId={}, gameId={}", userId, gameId);
        
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("Add to cart failed: User not found - userId={}", userId);
                    return new RuntimeException("User not found");
                });
        
        // Check if already in cart
        if (cartRepository.existsByUserIdAndGameId(userId, gameId)) {
            logger.warn("Add to cart failed: Game already in cart - userId={}, gameId={}", userId, gameId);
            throw new RuntimeException("Game already in cart");
        }
        
        // Get or create game
        Game game = gameRepository.findByGameId(gameId).orElse(null);
        
        if (game == null) {
            // Game doesn't exist in database, create it
            if (gameData == null) {
                logger.error("Add to cart failed: Game not found and no game data provided - userId={}, gameId={}", userId, gameId);
                throw new RuntimeException("Game not found and no game data provided");
            }
            logger.info("Creating new game entry: gameId={}, title={}", gameId, gameData.getTitle());
            
            game = new Game();
            game.setGameId(gameId);
            game.setTitle(gameData.getTitle() != null ? gameData.getTitle() : "Unknown Game");
            game.setImageUrl(gameData.getImageUrl() != null ? gameData.getImageUrl() : "");
            
            // Handle price conversion (can be BigDecimal, Double, or Number)
            if (gameData.getPrice() != null) {
                if (gameData.getPrice() instanceof BigDecimal) {
                    game.setPrice((BigDecimal) gameData.getPrice());
                } else if (gameData.getPrice() instanceof Number) {
                    game.setPrice(BigDecimal.valueOf(((Number) gameData.getPrice()).doubleValue()));
                } else {
                    game.setPrice(BigDecimal.valueOf(59.99));
                }
            } else {
                game.setPrice(BigDecimal.valueOf(59.99));
            }
            
            game.setDescription(gameData.getDescription());
            
            // Handle rating conversion
            if (gameData.getRating() != null) {
                if (gameData.getRating() instanceof BigDecimal) {
                    game.setRating((BigDecimal) gameData.getRating());
                } else if (gameData.getRating() instanceof Number) {
                    game.setRating(BigDecimal.valueOf(((Number) gameData.getRating()).doubleValue()));
                }
            }
            
            game.setGenre(gameData.getGenre());
            game.setDeveloper(gameData.getDeveloper());
            game.setPlatform(gameData.getPlatform());
            
            if (gameData.getReleaseDate() != null) {
                game.setReleaseDate(gameData.getReleaseDate());
            }
            
            game = gameRepository.save(game);
        }
        
        // Create cart item
        ShoppingCart cart = new ShoppingCart();
        cart.setUserId(userId);
        cart.setGameId(gameId);
        cart.setGameTitle(game.getTitle());
        cart.setGameImageUrl(game.getImageUrl());
        cart.setPrice(game.getPrice());
        
        ShoppingCart savedCart = cartRepository.save(cart);
        logger.info("Game added to cart successfully: userId={}, gameId={}, gameTitle={}", 
            userId, gameId, cart.getGameTitle());
        return savedCart;
    }
    
    @Transactional
    public void removeFromCart(String userId, Long gameId) {
        logger.debug("Removing game from cart: userId={}, gameId={}", userId, gameId);
        cartRepository.deleteByUserIdAndGameId(userId, gameId);
        logger.info("Game removed from cart successfully: userId={}, gameId={}", userId, gameId);
    }
    
    @Transactional
    public void clearCart(String userId) {
        logger.debug("Clearing cart for userId={}", userId);
        cartRepository.deleteByUserId(userId);
        logger.info("Cart cleared successfully for userId={}", userId);
    }
}

