package com.gamelibrary.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.gamelibrary.repository")
@EnableMongoAuditing
public class MongoConfig {
    // MongoDB configuration with auditing support
}

