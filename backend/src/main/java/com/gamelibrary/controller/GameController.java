package com.gamelibrary.controller;

import com.gamelibrary.model.Game;
import com.gamelibrary.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/games")
@CrossOrigin(origins = "*", maxAge = 3600)
public class GameController {
    
    @Autowired
    private GameService gameService;
    
    @GetMapping
    public ResponseEntity<List<Game>> getAllGames() {
        return ResponseEntity.ok(gameService.getAllGames());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Game> getGameById(@PathVariable Long id) {
        return gameService.getGameById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Game>> searchGames(@RequestParam String title) {
        return ResponseEntity.ok(gameService.searchGames(title));
    }
    
    @GetMapping("/top-rated")
    public ResponseEntity<List<Game>> getTopRated() {
        return ResponseEntity.ok(gameService.getTopRatedGames());
    }
}

