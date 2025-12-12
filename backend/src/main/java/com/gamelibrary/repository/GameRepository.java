package com.gamelibrary.repository;

import com.gamelibrary.model.Game;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends MongoRepository<Game, String> {
    Optional<Game> findByGameId(Long gameId);
    List<Game> findByGenreContainingIgnoreCase(String genre);
    List<Game> findByGenre(String genre);
    List<Game> findByTitleContainingIgnoreCase(String title);
    List<Game> findByPlatformContainingIgnoreCase(String platform);
    List<Game> findByPlatform(String platform);
    
    @Query("{'rating': {$gte: ?0}}")
    List<Game> findTopRatedGames(BigDecimal minRating, Sort sort);
    
    List<Game> findAllByOrderByCreatedAtDesc();
}

