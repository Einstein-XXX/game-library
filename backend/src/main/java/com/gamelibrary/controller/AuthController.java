package com.gamelibrary.controller;

import com.gamelibrary.dto.AuthResponse;
import com.gamelibrary.dto.LoginRequest;
import com.gamelibrary.dto.MessageResponse;
import com.gamelibrary.dto.RegisterRequest;
import com.gamelibrary.service.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            logger.info("Registration attempt: email={}", request.getEmail());
            AuthResponse response = authService.register(request);
            logger.info("Registration successful: email={}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.warn("Registration failed: email={}, error={}", request.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            logger.info("Login attempt: email={}", request.getEmail());
            AuthResponse response = authService.login(request);
            logger.info("Login successful: email={}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.warn("Login failed: email={}, error={}", request.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid email or password"));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
    }
    
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(new MessageResponse("Backend is running! 🚀"));
    }
}

