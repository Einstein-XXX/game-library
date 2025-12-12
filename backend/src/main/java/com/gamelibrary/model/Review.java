package com.gamelibrary.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;

import java.time.LocalDateTime;

@Document(collection = "reviews")
@CompoundIndex(name = "user_game_review_idx", def = "{'userId': 1, 'gameId': 1}", unique = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    
    @Id
    private String id;
    
    private String userId;
    private String username;
    private Long gameId;
    private Integer rating; // 1-5 stars
    private String comment;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}

