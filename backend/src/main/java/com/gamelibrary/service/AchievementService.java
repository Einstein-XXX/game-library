package com.gamelibrary.service;

import com.gamelibrary.model.Achievement;
import com.gamelibrary.repository.AchievementRepository;
import com.gamelibrary.repository.GameLibraryRepository;
import com.gamelibrary.repository.OrderRepository;
import com.gamelibrary.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AchievementService {
    
    @Autowired
    private AchievementRepository achievementRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private GameLibraryRepository libraryRepository;
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    private static final Map<String, AchievementDefinition> ACHIEVEMENT_DEFINITIONS = new HashMap<>();
    
    static {
        ACHIEVEMENT_DEFINITIONS.put("FIRST_PURCHASE", new AchievementDefinition(
            "First Purchase", "🎮", "Made your first game purchase"
        ));
        ACHIEVEMENT_DEFINITIONS.put("COLLECTOR_5", new AchievementDefinition(
            "Collector", "📚", "Own 5 games"
        ));
        ACHIEVEMENT_DEFINITIONS.put("COLLECTOR_10", new AchievementDefinition(
            "Master Collector", "📖", "Own 10 games"
        ));
        ACHIEVEMENT_DEFINITIONS.put("REVIEWER", new AchievementDefinition(
            "Reviewer", "⭐", "Write your first review"
        ));
        ACHIEVEMENT_DEFINITIONS.put("REVIEWER_5", new AchievementDefinition(
            "Critic", "📝", "Write 5 reviews"
        ));
        ACHIEVEMENT_DEFINITIONS.put("WISHLIST_10", new AchievementDefinition(
            "Dreamer", "❤️", "Add 10 games to wishlist"
        ));
        ACHIEVEMENT_DEFINITIONS.put("SPENDER_100", new AchievementDefinition(
            "Big Spender", "💰", "Spend $100 on games"
        ));
        ACHIEVEMENT_DEFINITIONS.put("SPENDER_500", new AchievementDefinition(
            "Whale", "🐋", "Spend $500 on games"
        ));
    }
    
    public List<Achievement> getUserAchievements(String userId) {
        return achievementRepository.findByUserId(userId);
    }
    
    public List<Achievement> checkAndUnlockAchievements(String userId) {
        List<Achievement> newAchievements = new ArrayList<>();
        
        // Check First Purchase
        long orderCount = orderRepository.findByUserId(userId).size();
        if (orderCount >= 1) {
            unlockAchievement(userId, "FIRST_PURCHASE", newAchievements);
        }
        
        // Check Collector achievements
        long libraryCount = libraryRepository.countByUserId(userId);
        if (libraryCount >= 10) {
            unlockAchievement(userId, "COLLECTOR_10", newAchievements);
        } else if (libraryCount >= 5) {
            unlockAchievement(userId, "COLLECTOR_5", newAchievements);
        }
        
        // Check Reviewer achievements
        long reviewCount = reviewRepository.findByUserId(userId).size();
        if (reviewCount >= 5) {
            unlockAchievement(userId, "REVIEWER_5", newAchievements);
        } else if (reviewCount >= 1) {
            unlockAchievement(userId, "REVIEWER", newAchievements);
        }
        
        // Check Spender achievements
        double totalSpent = orderRepository.findByUserId(userId).stream()
                .mapToDouble(o -> o.getTotalAmount().doubleValue())
                .sum();
        if (totalSpent >= 500) {
            unlockAchievement(userId, "SPENDER_500", newAchievements);
        } else if (totalSpent >= 100) {
            unlockAchievement(userId, "SPENDER_100", newAchievements);
        }
        
        return newAchievements;
    }
    
    private void unlockAchievement(String userId, String achievementType, List<Achievement> newAchievements) {
        if (!achievementRepository.existsByUserIdAndAchievementType(userId, achievementType)) {
            AchievementDefinition def = ACHIEVEMENT_DEFINITIONS.get(achievementType);
            if (def != null) {
                Achievement achievement = new Achievement();
                achievement.setUserId(userId);
                achievement.setAchievementType(achievementType);
                achievement.setAchievementName(def.name);
                achievement.setDescription(def.description);
                achievement.setIcon(def.icon);
                
                achievement = achievementRepository.save(achievement);
                newAchievements.add(achievement);
            }
        }
    }
    
    private static class AchievementDefinition {
        String name;
        String icon;
        String description;
        
        AchievementDefinition(String name, String icon, String description) {
            this.name = name;
            this.icon = icon;
            this.description = description;
        }
    }
}

