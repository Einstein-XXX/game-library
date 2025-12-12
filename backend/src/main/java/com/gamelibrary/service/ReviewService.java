package com.gamelibrary.service;

import com.gamelibrary.model.Review;
import com.gamelibrary.repository.ReviewRepository;
import com.gamelibrary.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Review> getGameReviews(Long gameId) {
        return reviewRepository.findByGameId(gameId);
    }
    
    public Review addReview(String userId, Long gameId, Integer rating, String comment) {
        // Verify user exists
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if user already reviewed this game
        Optional<Review> existingReview = reviewRepository.findByUserIdAndGameId(userId, gameId);
        
        Review review;
        if (existingReview.isPresent()) {
            review = existingReview.get();
            review.setRating(rating);
            review.setComment(comment);
        } else {
            review = new Review();
            review.setUserId(userId);
            review.setUsername(user.getUsername());
            review.setGameId(gameId);
            review.setRating(rating);
            review.setComment(comment);
        }
        
        return reviewRepository.save(review);
    }
    
    public void deleteReview(String userId, Long gameId) {
        reviewRepository.findByUserIdAndGameId(userId, gameId)
                .ifPresent(reviewRepository::delete);
    }
    
    public double getAverageRating(Long gameId) {
        List<Review> reviews = reviewRepository.findByGameId(gameId);
        if (reviews.isEmpty()) {
            return 0.0;
        }
        
        double sum = reviews.stream()
                .mapToInt(Review::getRating)
                .sum();
        
        return sum / reviews.size();
    }
    
    public long getReviewCount(Long gameId) {
        return reviewRepository.countByGameId(gameId);
    }
}

