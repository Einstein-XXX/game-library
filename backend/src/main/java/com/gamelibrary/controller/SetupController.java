package com.gamelibrary.controller;

import com.gamelibrary.dto.MessageResponse;
import com.gamelibrary.model.AdminUser;
import com.gamelibrary.model.User;
import com.gamelibrary.repository.AdminUserRepository;
import com.gamelibrary.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Setup Controller - For initial setup and admin management
 * NOTE: In production, you should secure these endpoints or remove them
 */
@RestController
@RequestMapping("/setup")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SetupController {
    
    private static final Logger logger = LoggerFactory.getLogger(SetupController.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AdminUserRepository adminUserRepository;
    
    /**
     * Make a user admin by email (GET for easy browser access)
     * Usage: GET http://localhost:8080/api/setup/make-admin/{email}
     * Example: http://localhost:8080/api/setup/make-admin/user@example.com
     */
    @GetMapping("/make-admin/{email}")
    public ResponseEntity<?> makeUserAdminGet(@PathVariable String email) {
        return makeUserAdmin(email);
    }
    
    /**
     * Make a user admin by email (POST)
     * Usage: POST http://localhost:8080/api/setup/make-admin/{email}
     */
    @PostMapping("/make-admin/{email}")
    public ResponseEntity<?> makeUserAdmin(@PathVariable String email) {
        try {
            logger.info("Attempting to make user admin: {}", email);
            
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            
            // Update role to ADMIN
            user.setRole("ADMIN");
            userRepository.save(user);
            logger.info("Updated user role to ADMIN for: {}", email);
            
            // Create admin user entry if doesn't exist
            if (!adminUserRepository.existsByUserId(user.getId())) {
                AdminUser adminUser = new AdminUser();
                adminUser.setUserId(user.getId());
                adminUser.setPermissions("{\"manageUsers\": true, \"manageGames\": true, \"viewOrders\": true, \"manageOrders\": true}");
                adminUserRepository.save(adminUser);
                logger.info("Created AdminUser entry for: {}", email);
            } else {
                logger.info("AdminUser entry already exists for: {}", email);
            }
            
            return ResponseEntity.ok(new MessageResponse("✅ User " + email + " is now an ADMIN!"));
        } catch (Exception e) {
            logger.error("Error making user admin: {}", email, e);
            return ResponseEntity.badRequest().body(new MessageResponse("❌ Error: " + e.getMessage()));
        }
    }
    
    /**
     * Make a user admin by email (query parameter version)
     * Usage: GET http://localhost:8080/api/setup/make-admin?email=user@example.com
     */
    @GetMapping("/make-admin")
    public ResponseEntity<?> makeUserAdminQuery(@RequestParam String email) {
        return makeUserAdmin(email);
    }
    
    /**
     * Check if a user is admin
     * Usage: GET http://localhost:8080/api/setup/check-admin/{email}
     */
    @GetMapping("/check-admin/{email}")
    public ResponseEntity<?> checkAdmin(@PathVariable String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            
            boolean isAdmin = "ADMIN".equals(user.getRole());
            boolean hasAdminEntry = adminUserRepository.existsByUserId(user.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("email", email);
            response.put("username", user.getUsername());
            response.put("isAdmin", isAdmin);
            response.put("hasAdminEntry", hasAdminEntry);
            response.put("role", user.getRole());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Get all users (for debugging)
     * Usage: GET http://localhost:8080/api/setup/users
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
    
    /**
     * Get all admin users
     * Usage: GET http://localhost:8080/api/setup/admins
     */
    @GetMapping("/admins")
    public ResponseEntity<?> getAllAdmins() {
        return ResponseEntity.ok(adminUserRepository.findAll());
    }
}

