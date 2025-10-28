package com.gamelibrary.repository;

import com.gamelibrary.model.GameLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameLogRepository extends JpaRepository<GameLog, Long> {
    List<GameLog> findByGame_GameId(Long gameId);
    List<GameLog> findByUser_UserId(Long userId);
    List<GameLog> findByAction(String action);
}

