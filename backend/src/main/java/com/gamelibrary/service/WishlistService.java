package com.gamelibrary.service;

import com.gamelibrary.model.Game;
import com.gamelibrary.model.Wishlist;
import com.gamelibrary.repository.GameRepository;
import com.gamelibrary.repository.UserRepository;
import com.gamelibrary.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistService {
    
    @Autowired
    private WishlistRepository wishlistRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private GameRepository gameRepository;
    
    public List<Wishlist> getUserWishlist(String userId) {
        return wishlistRepository.findByUserId(userId);
    }
    
    public Wishlist addToWishlist(String userId, Long gameId, Game gameData) {
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if already in wishlist
        if (wishlistRepository.existsByUserIdAndGameId(userId, gameId)) {
            throw new RuntimeException("Game already in wishlist");
        }
        
        // Get or create game
        Game game = gameRepository.findByGameId(gameId).orElse(null);
        
        if (game == null) {
            if (gameData == null) {
                throw new RuntimeException("Game not found and no game data provided");
            }
            
            game = new Game();
            game.setGameId(gameId);
            game.setTitle(gameData.getTitle() != null ? gameData.getTitle() : "Unknown Game");
            game.setImageUrl(gameData.getImageUrl() != null ? gameData.getImageUrl() : "");
            game.setPrice(gameData.getPrice() != null ? gameData.getPrice() : java.math.BigDecimal.valueOf(59.99));
            game.setDescription(gameData.getDescription());
            game.setRating(gameData.getRating());
            game.setGenre(gameData.getGenre());
            game.setDeveloper(gameData.getDeveloper());
            game.setPlatform(gameData.getPlatform());
            
            if (gameData.getReleaseDate() != null) {
                game.setReleaseDate(gameData.getReleaseDate());
            }
            
            game = gameRepository.save(game);
        }
        
        // Create wishlist item
        Wishlist wishlist = new Wishlist();
        wishlist.setUserId(userId);
        wishlist.setGameId(gameId);
        wishlist.setGameTitle(game.getTitle());
        wishlist.setGameImageUrl(game.getImageUrl());
        
        return wishlistRepository.save(wishlist);
    }
    
    public void removeFromWishlist(String userId, Long gameId) {
        wishlistRepository.deleteByUserIdAndGameId(userId, gameId);
    }
    
    public boolean isInWishlist(String userId, Long gameId) {
        return wishlistRepository.existsByUserIdAndGameId(userId, gameId);
    }
}

