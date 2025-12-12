package com.gamelibrary.repository;

import com.gamelibrary.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByGameId(Long gameId);
    List<Review> findByUserId(String userId);
    Optional<Review> findByUserIdAndGameId(String userId, Long gameId);
    Boolean existsByUserIdAndGameId(String userId, Long gameId);
    long countByGameId(Long gameId);
}

