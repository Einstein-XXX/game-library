package com.gamelibrary.repository;

import com.gamelibrary.model.ShoppingCart;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShoppingCartRepository extends MongoRepository<ShoppingCart, String> {
    List<ShoppingCart> findByUserId(String userId);
    Optional<ShoppingCart> findByUserIdAndGameId(String userId, Long gameId);
    Boolean existsByUserIdAndGameId(String userId, Long gameId);
    void deleteByUserId(String userId);
    void deleteByUserIdAndGameId(String userId, Long gameId);
}

