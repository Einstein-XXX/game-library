package com.gamelibrary.repository;

import com.gamelibrary.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_UserId(Long userId);
    List<Order> findByStatus(String status);
    List<Order> findByUser_UserIdOrderByCreatedAtDesc(Long userId);
}

