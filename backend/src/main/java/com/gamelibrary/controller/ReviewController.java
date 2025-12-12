package com.gamelibrary.controller;

import com.gamelibrary.dto.MessageResponse;
import com.gamelibrary.model.Review;
import com.gamelibrary.security.UserDetailsImpl;
import com.gamelibrary.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;
    
    @GetMapping("/game/{gameId}")
    public ResponseEntity<List<Review>> getGameReviews(@PathVariable Long gameId) {
        return ResponseEntity.ok(reviewService.getGameReviews(gameId));
    }
    
    @GetMapping("/game/{gameId}/stats")
    public ResponseEntity<Map<String, Object>> getGameReviewStats(@PathVariable Long gameId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("averageRating", reviewService.getAverageRating(gameId));
        stats.put("reviewCount", reviewService.getReviewCount(gameId));
        return ResponseEntity.ok(stats);
    }
    
    @PostMapping("/game/{gameId}")
    public ResponseEntity<?> addReview(
            @PathVariable Long gameId,
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Integer rating = Integer.parseInt(request.get("rating").toString());
            String comment = request.get("comment") != null ? request.get("comment").toString() : "";
            
            if (rating < 1 || rating > 5) {
                return ResponseEntity.badRequest().body(new MessageResponse("Rating must be between 1 and 5"));
            }
            
            Review review = reviewService.addReview(userDetails.getId(), gameId, rating, comment);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/game/{gameId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long gameId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        reviewService.deleteReview(userDetails.getId(), gameId);
        return ResponseEntity.ok(new MessageResponse("Review deleted"));
    }
}

