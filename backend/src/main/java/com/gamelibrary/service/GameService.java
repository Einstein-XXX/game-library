package com.gamelibrary.service;

import com.gamelibrary.model.Game;
import com.gamelibrary.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GameService {
    
    @Autowired
    private GameRepository gameRepository;
    
    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }
    
    public Optional<Game> getGameById(Long id) {
        return gameRepository.findById(id);
    }
    
    public List<Game> searchGames(String title) {
        return gameRepository.findByTitleContainingIgnoreCase(title);
    }
    
    public List<Game> getTopRatedGames() {
        return gameRepository.findTopRatedGames(4.0);
    }
    
    public Game saveGame(Game game) {
        return gameRepository.save(game);
    }
}

