package com.gamelibrary.service;

import com.gamelibrary.model.Game;
import com.gamelibrary.model.GameLibrary;
import com.gamelibrary.repository.GameLibraryRepository;
import com.gamelibrary.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {
    
    @Autowired
    private GameLibraryRepository libraryRepository;
    
    @Autowired
    private GameRepository gameRepository;
    
    public List<Game> getRecommendations(String userId) {
        // Get user's library
        List<GameLibrary> userLibrary = libraryRepository.findByUserId(userId);
        
        if (userLibrary.isEmpty()) {
            // If no library, return popular games
            return getPopularGames();
        }
        
        // Get genres from user's library
        Set<String> userGenres = new HashSet<>();
        for (GameLibrary item : userLibrary) {
            Game game = gameRepository.findByGameId(item.getGameId()).orElse(null);
            if (game != null && game.getGenre() != null) {
                userGenres.add(game.getGenre());
            }
        }
        
        // Find games with similar genres
        List<Game> recommendations = new ArrayList<>();
        for (String genre : userGenres) {
            List<Game> games = gameRepository.findByGenreContainingIgnoreCase(genre);
            recommendations.addAll(games);
        }
        
        // Remove games already in library
        Set<Long> ownedGameIds = userLibrary.stream()
                .map(GameLibrary::getGameId)
                .collect(Collectors.toSet());
        
        recommendations = recommendations.stream()
                .filter(game -> !ownedGameIds.contains(game.getGameId()))
                .distinct()
                .limit(10)
                .collect(Collectors.toList());
        
        // If not enough recommendations, add popular games
        if (recommendations.size() < 10) {
            List<Game> popular = getPopularGames();
            for (Game game : popular) {
                if (!ownedGameIds.contains(game.getGameId()) && recommendations.size() < 10) {
                    recommendations.add(game);
                }
            }
        }
        
        return recommendations;
    }
    
    private List<Game> getPopularGames() {
        // Return top-rated games
        return gameRepository.findAll().stream()
                .filter(game -> game.getRating() != null && game.getRating().doubleValue() >= 4.0)
                .sorted((a, b) -> Double.compare(
                        b.getRating().doubleValue(),
                        a.getRating().doubleValue()
                ))
                .limit(10)
                .collect(Collectors.toList());
    }
}

