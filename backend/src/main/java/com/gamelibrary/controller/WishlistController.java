package com.gamelibrary.controller;

import com.gamelibrary.dto.MessageResponse;
import com.gamelibrary.model.Game;
import com.gamelibrary.model.Wishlist;
import com.gamelibrary.security.UserDetailsImpl;
import com.gamelibrary.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@CrossOrigin(origins = "*", maxAge = 3600)
public class WishlistController {
    
    @Autowired
    private WishlistService wishlistService;
    
    @GetMapping
    public ResponseEntity<List<Wishlist>> getWishlist(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(wishlistService.getUserWishlist(userDetails.getId()));
    }
    
    @PostMapping("/add/{gameId}")
    public ResponseEntity<?> addToWishlist(
            @PathVariable Long gameId,
            @RequestBody(required = false) Game gameData,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Wishlist wishlist = wishlistService.addToWishlist(userDetails.getId(), gameId, gameData);
            return ResponseEntity.ok(wishlist);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/remove/{gameId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long gameId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        wishlistService.removeFromWishlist(userDetails.getId(), gameId);
        return ResponseEntity.ok(new MessageResponse("Removed from wishlist"));
    }
    
    @GetMapping("/check/{gameId}")
    public ResponseEntity<Boolean> isInWishlist(@PathVariable Long gameId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(wishlistService.isInWishlist(userDetails.getId(), gameId));
    }
}

