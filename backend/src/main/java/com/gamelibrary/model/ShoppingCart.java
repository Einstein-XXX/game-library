package com.gamelibrary.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "shopping_cart")
@CompoundIndex(name = "user_game_cart_idx", def = "{'userId': 1, 'gameId': 1}", unique = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingCart {
    
    @Id
    private String id;
    
    private String userId;
    private Long gameId;
    private String gameTitle;
    private String gameImageUrl;
    private BigDecimal price;
    
    @CreatedDate
    private LocalDateTime addedAt;
}

