package com.gamelibrary.repository;

import com.gamelibrary.model.GameLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameLogRepository extends MongoRepository<GameLog, String> {
    List<GameLog> findByGameId(Long gameId);
    List<GameLog> findByUserId(String userId);
    List<GameLog> findByAction(String action);
}

