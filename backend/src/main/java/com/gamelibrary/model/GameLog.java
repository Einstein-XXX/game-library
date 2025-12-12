package com.gamelibrary.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "game_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameLog {
    
    @Id
    private String id;
    
    private Long gameId;
    private String userId;
    private String action;
    
    @CreatedDate
    private LocalDateTime timestamp;
}

