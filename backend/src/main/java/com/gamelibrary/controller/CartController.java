package com.gamelibrary.controller;

import com.gamelibrary.dto.MessageResponse;
import com.gamelibrary.model.ShoppingCart;
import com.gamelibrary.security.UserDetailsImpl;
import com.gamelibrary.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @GetMapping
    public ResponseEntity<List<ShoppingCart>> getCart(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(cartService.getUserCart(userDetails.getId()));
    }
    
    @PostMapping("/add/{gameId}")
    public ResponseEntity<?> addToCart(@PathVariable Long gameId, Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            ShoppingCart cart = cartService.addToCart(userDetails.getId(), gameId);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/remove/{gameId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long gameId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        cartService.removeFromCart(userDetails.getId(), gameId);
        return ResponseEntity.ok(new MessageResponse("Item removed from cart"));
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        cartService.clearCart(userDetails.getId());
        return ResponseEntity.ok(new MessageResponse("Cart cleared"));
    }
}

