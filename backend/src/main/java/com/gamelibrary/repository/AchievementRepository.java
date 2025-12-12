package com.gamelibrary.repository;

import com.gamelibrary.model.Achievement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AchievementRepository extends MongoRepository<Achievement, String> {
    List<Achievement> findByUserId(String userId);
    Optional<Achievement> findByUserIdAndAchievementType(String userId, String achievementType);
    Boolean existsByUserIdAndAchievementType(String userId, String achievementType);
    long countByUserId(String userId);
}

