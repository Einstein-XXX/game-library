package com.gamelibrary.repository;

import com.gamelibrary.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findByGenreContainingIgnoreCase(String genre);
    List<Game> findByTitleContainingIgnoreCase(String title);
    List<Game> findByPlatformContainingIgnoreCase(String platform);
    
    @Query("SELECT g FROM Game g WHERE g.rating >= :minRating ORDER BY g.rating DESC")
    List<Game> findTopRatedGames(@Param("minRating") Double minRating);
    
    @Query("SELECT g FROM Game g ORDER BY g.createdAt DESC")
    List<Game> findNewReleases();
}

