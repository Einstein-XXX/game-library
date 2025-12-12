package com.gamelibrary.controller;

import com.gamelibrary.dto.MessageResponse;
import com.gamelibrary.model.Game;
import com.gamelibrary.model.ShoppingCart;
import com.gamelibrary.security.UserDetailsImpl;
import com.gamelibrary.service.CartService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CartController {
    
    private static final Logger logger = LoggerFactory.getLogger(CartController.class);
    
    @Autowired
    private CartService cartService;
    
    @GetMapping
    public ResponseEntity<List<ShoppingCart>> getCart(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        logger.debug("Fetching cart for userId={}", userDetails.getId());
        return ResponseEntity.ok(cartService.getUserCart(userDetails.getId()));
    }
    
    @PostMapping("/add/{gameId}")
    public ResponseEntity<?> addToCart(
            @PathVariable Long gameId, 
            @RequestBody(required = false) Game gameData,
            Authentication authentication) {
        try {
            if (authentication == null) {
                logger.warn("Add to cart failed: Authentication required for gameId={}", gameId);
                return ResponseEntity.status(401).body(new MessageResponse("Authentication required"));
            }
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            logger.info("Adding game to cart: userId={}, gameId={}", userDetails.getId(), gameId);
            ShoppingCart cart = cartService.addToCart(userDetails.getId(), gameId, gameData);
            logger.info("Successfully added game to cart: userId={}, gameId={}", userDetails.getId(), gameId);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            logger.error("Failed to add game to cart: userId={}, gameId={}, error={}", 
                authentication != null ? ((UserDetailsImpl) authentication.getPrincipal()).getId() : "unknown", 
                gameId, e.getMessage(), e);
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error adding game to cart: userId={}, gameId={}", 
                authentication != null ? ((UserDetailsImpl) authentication.getPrincipal()).getId() : "unknown", 
                gameId, e);
            return ResponseEntity.internalServerError().body(new MessageResponse("Failed to add to cart: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/remove/{gameId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long gameId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        logger.info("Removing game from cart: userId={}, gameId={}", userDetails.getId(), gameId);
        cartService.removeFromCart(userDetails.getId(), gameId);
        return ResponseEntity.ok(new MessageResponse("Item removed from cart"));
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        logger.info("Clearing cart for userId={}", userDetails.getId());
        cartService.clearCart(userDetails.getId());
        return ResponseEntity.ok(new MessageResponse("Cart cleared"));
    }
}

