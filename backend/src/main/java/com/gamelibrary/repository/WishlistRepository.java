package com.gamelibrary.repository;

import com.gamelibrary.model.Wishlist;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends MongoRepository<Wishlist, String> {
    List<Wishlist> findByUserId(String userId);
    Optional<Wishlist> findByUserIdAndGameId(String userId, Long gameId);
    Boolean existsByUserIdAndGameId(String userId, Long gameId);
    void deleteByUserIdAndGameId(String userId, Long gameId);
    void deleteByUserId(String userId);
}

