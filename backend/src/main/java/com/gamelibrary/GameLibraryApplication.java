package com.gamelibrary;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GameLibraryApplication {
    
    private static final Logger logger = LoggerFactory.getLogger(GameLibraryApplication.class);
    
    public static void main(String[] args) {
        SpringApplication.run(GameLibraryApplication.class, args);
        logger.info("\n===========================================");
        logger.info("🎮 GameLibrary Backend API Started!");
        logger.info("📍 Server running at: http://localhost:8080/api");
        logger.info("📚 API Documentation: http://localhost:8080/api/swagger-ui.html");
        logger.info("📝 Logs directory: logs/");
        logger.info("===========================================\n");
    }
}

