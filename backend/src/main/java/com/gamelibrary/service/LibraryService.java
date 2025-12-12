package com.gamelibrary.service;

import com.gamelibrary.model.Game;
import com.gamelibrary.model.GameLibrary;
import com.gamelibrary.repository.GameLibraryRepository;
import com.gamelibrary.repository.GameRepository;
import com.gamelibrary.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LibraryService {
    
    @Autowired
    private GameLibraryRepository libraryRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private GameRepository gameRepository;
    
    public List<GameLibrary> getUserLibrary(String userId) {
        return libraryRepository.findByUserId(userId);
    }
    
    public GameLibrary addToLibrary(String userId, Long gameId) {
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Get game details
        Game game = gameRepository.findByGameId(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        
        if (libraryRepository.existsByUserIdAndGameId(userId, gameId)) {
            throw new RuntimeException("Game already in library");
        }
        
        GameLibrary library = new GameLibrary();
        library.setUserId(userId);
        library.setGameId(gameId);
        library.setGameTitle(game.getTitle());
        library.setGameImageUrl(game.getImageUrl());
        library.setPricePaid(game.getPrice());
        
        return libraryRepository.save(library);
    }
    
    public boolean isInLibrary(String userId, Long gameId) {
        return libraryRepository.existsByUserIdAndGameId(userId, gameId);
    }
}

