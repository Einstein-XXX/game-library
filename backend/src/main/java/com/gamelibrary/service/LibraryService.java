package com.gamelibrary.service;

import com.gamelibrary.model.Game;
import com.gamelibrary.model.GameLibrary;
import com.gamelibrary.model.User;
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
    
    public List<GameLibrary> getUserLibrary(Long userId) {
        return libraryRepository.findByUser_UserId(userId);
    }
    
    public GameLibrary addToLibrary(Long userId, Long gameId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        
        if (libraryRepository.existsByUser_UserIdAndGame_GameId(userId, gameId)) {
            throw new RuntimeException("Game already in library");
        }
        
        GameLibrary library = new GameLibrary();
        library.setUser(user);
        library.setGame(game);
        
        return libraryRepository.save(library);
    }
    
    public boolean isInLibrary(Long userId, Long gameId) {
        return libraryRepository.existsByUser_UserIdAndGame_GameId(userId, gameId);
    }
}

