package com.gamelibrary;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GameLibraryApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(GameLibraryApplication.class, args);
        System.out.println("\n===========================================");
        System.out.println("🎮 GameLibrary Backend API Started!");
        System.out.println("📍 Server running at: http://localhost:8080/api");
        System.out.println("📚 API Documentation: http://localhost:8080/api/swagger-ui.html");
        System.out.println("===========================================\n");
    }
}

