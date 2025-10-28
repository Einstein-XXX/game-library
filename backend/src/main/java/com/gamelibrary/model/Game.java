package com.gamelibrary.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "games")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Game {
    
    @Id
    @Column(name = "game_id")
    private Long gameId; // Using RAWG API game_id
    
    @Column(nullable = false, length = 500)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price = BigDecimal.valueOf(59.99);
    
    private String genre;
    
    @Column(name = "release_date")
    private LocalDate releaseDate;
    
    private String developer;
    
    private String platform;
    
    @Column(name = "playtime_hours")
    private Integer playtimeHours;
    
    @Column(precision = 3, scale = 2)
    private BigDecimal rating;
    
    @Column(name = "image_url", length = 1000)
    private String imageUrl;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    private List<GameLibrary> libraries = new ArrayList<>();
    
    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    private List<ShoppingCart> cartItems = new ArrayList<>();
    
    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    private List<GameLog> logs = new ArrayList<>();
}

