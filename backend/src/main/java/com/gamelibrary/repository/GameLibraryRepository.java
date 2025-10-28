package com.gamelibrary.repository;

import com.gamelibrary.model.GameLibrary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameLibraryRepository extends JpaRepository<GameLibrary, Long> {
    List<GameLibrary> findByUser_UserId(Long userId);
    Optional<GameLibrary> findByUser_UserIdAndGame_GameId(Long userId, Long gameId);
    Boolean existsByUser_UserIdAndGame_GameId(Long userId, Long gameId);
}

