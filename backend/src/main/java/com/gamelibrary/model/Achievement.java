package com.gamelibrary.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "achievements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Achievement {
    
    @Id
    private String id;
    
    private String userId;
    private String achievementType; // FIRST_PURCHASE, COLLECTOR, REVIEWER, etc.
    private String achievementName;
    private String description;
    private String icon; // Emoji or icon identifier
    
    @CreatedDate
    private LocalDateTime unlockedAt;
}

