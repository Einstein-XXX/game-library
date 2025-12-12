package com.gamelibrary.repository;

import com.gamelibrary.model.GameLibrary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameLibraryRepository extends MongoRepository<GameLibrary, String> {
    List<GameLibrary> findByUserId(String userId);
    Optional<GameLibrary> findByUserIdAndGameId(String userId, Long gameId);
    Boolean existsByUserIdAndGameId(String userId, Long gameId);
    long countByUserId(String userId);
}

