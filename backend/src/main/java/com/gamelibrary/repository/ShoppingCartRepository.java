package com.gamelibrary.repository;

import com.gamelibrary.model.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Long> {
    List<ShoppingCart> findByUser_UserId(Long userId);
    Optional<ShoppingCart> findByUser_UserIdAndGame_GameId(Long userId, Long gameId);
    void deleteByUser_UserId(Long userId);
    void deleteByUser_UserIdAndGame_GameId(Long userId, Long gameId);
}

