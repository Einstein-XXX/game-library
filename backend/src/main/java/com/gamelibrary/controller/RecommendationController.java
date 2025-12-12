package com.gamelibrary.controller;

import com.gamelibrary.model.Game;
import com.gamelibrary.security.UserDetailsImpl;
import com.gamelibrary.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recommendations")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RecommendationController {
    
    @Autowired
    private RecommendationService recommendationService;
    
    @GetMapping
    public ResponseEntity<List<Game>> getRecommendations(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(recommendationService.getRecommendations(userDetails.getId()));
    }
}

