package com.gamelibrary.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "admin_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUser {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String userId;
    
    private String permissions;
    
    @CreatedDate
    private LocalDateTime createdAt;
}

