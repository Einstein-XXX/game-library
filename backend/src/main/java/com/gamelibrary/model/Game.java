package com.gamelibrary.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "games")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Game {
    
    @Id
    private String id;
    
    private Long gameId; // RAWG API game_id
    
    private String title;
    private String description;
    private BigDecimal price = BigDecimal.valueOf(59.99);
    private String genre;
    private LocalDate releaseDate;
    private String developer;
    private String platform;
    private Integer playtimeHours;
    private BigDecimal rating;
    private String imageUrl;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}

