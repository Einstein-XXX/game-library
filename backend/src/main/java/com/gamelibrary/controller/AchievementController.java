package com.gamelibrary.controller;

import com.gamelibrary.model.Achievement;
import com.gamelibrary.security.UserDetailsImpl;
import com.gamelibrary.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/achievements")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AchievementController {
    
    @Autowired
    private AchievementService achievementService;
    
    @GetMapping
    public ResponseEntity<List<Achievement>> getMyAchievements(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(achievementService.getUserAchievements(userDetails.getId()));
    }
    
    @PostMapping("/check")
    public ResponseEntity<?> checkAchievements(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<Achievement> newAchievements = achievementService.checkAndUnlockAchievements(userDetails.getId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("newAchievements", newAchievements);
        response.put("message", newAchievements.isEmpty() ? "No new achievements" : "Unlocked " + newAchievements.size() + " achievement(s)!");
        
        return ResponseEntity.ok(response);
    }
}

