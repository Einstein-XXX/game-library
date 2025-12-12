package com.gamelibrary.service;

import com.gamelibrary.model.Game;
import com.gamelibrary.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class GameService {
    
    @Autowired
    private GameRepository gameRepository;
    
    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }
    
    public Optional<Game> getGameById(Long gameId) {
        return gameRepository.findByGameId(gameId);
    }
    
    public List<Game> searchGames(String title) {
        return gameRepository.findByTitleContainingIgnoreCase(title);
    }
    
    public List<Game> getTopRatedGames() {
        Sort sort = Sort.by(Sort.Direction.DESC, "rating");
        return gameRepository.findTopRatedGames(BigDecimal.valueOf(4.0), sort);
    }
    
    public Game saveGame(Game game) {
        return gameRepository.save(game);
    }
}

