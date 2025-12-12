package com.gamelibrary.config;

import com.gamelibrary.model.AdminUser;
import com.gamelibrary.model.User;
import com.gamelibrary.repository.AdminUserRepository;
import com.gamelibrary.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Data Initializer - Runs on application startup to ensure admin user exists
 * This ensures that there's always an admin user available, even after database resets
 */
@Component
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AdminUserRepository adminUserRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // Admin configuration from application.properties
    @Value("${app.admin.email:admin@gamelibrary.com}")
    private String adminEmail;
    
    @Value("${app.admin.password:admin123}")
    private String adminPassword;
    
    @Value("${app.admin.username:admin}")
    private String adminUsername;
    
    @Value("${app.admin.auto-create:true}")
    private boolean autoCreateAdmin;
    
    @Override
    public void run(String... args) {
        if (!autoCreateAdmin) {
            logger.info("Auto-create admin is disabled. Skipping admin user initialization.");
            return;
        }
        
        logger.info("🔍 Checking for admin user...");
        
        // Check if admin user exists
        Optional<User> existingAdmin = userRepository.findByEmail(adminEmail);
        
        if (existingAdmin.isPresent()) {
            User admin = existingAdmin.get();
            
            // Ensure user has ADMIN role
            if (!"ADMIN".equals(admin.getRole())) {
                logger.info("⚠️  User {} exists but is not ADMIN. Updating role...", adminEmail);
                admin.setRole("ADMIN");
                userRepository.save(admin);
            }
            
            // Ensure AdminUser entry exists
            if (!adminUserRepository.existsByUserId(admin.getId())) {
                logger.info("📝 Creating AdminUser entry for {}", adminEmail);
                AdminUser adminUser = new AdminUser();
                adminUser.setUserId(admin.getId());
                adminUser.setPermissions("{\"manageUsers\": true, \"manageGames\": true, \"viewOrders\": true, \"manageOrders\": true}");
                adminUserRepository.save(adminUser);
            } else {
                logger.info("✅ Admin user already exists: {}", adminEmail);
            }
        } else {
            // Create new admin user
            logger.info("👤 Creating new admin user: {} ({})", adminUsername, adminEmail);
            
            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setEmail(adminEmail);
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setRole("ADMIN");
            
            admin = userRepository.save(admin);
            
            // Create AdminUser entry
            AdminUser adminUser = new AdminUser();
            adminUser.setUserId(admin.getId());
            adminUser.setPermissions("{\"manageUsers\": true, \"manageGames\": true, \"viewOrders\": true, \"manageOrders\": true}");
            adminUserRepository.save(adminUser);
            
            logger.info("✅ Admin user created successfully!");
            logger.info("   Email: {}", adminEmail);
            logger.info("   Username: {}", adminUsername);
            logger.info("   Password: {} (CHANGE THIS IN PRODUCTION!)", adminPassword);
        }
        
        logger.info("🎮 Admin initialization complete!");
    }
}

