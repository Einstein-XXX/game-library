package com.gamelibrary.security;

import com.gamelibrary.model.User;
import com.gamelibrary.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(OAuth2AuthenticationSuccessHandler.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                       Authentication authentication) throws IOException {
        
        if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User)) {
            logger.warn("OAuth2 authentication failed: Invalid authentication principal");
            response.sendRedirect("http://localhost:5173/login?error=oauth_failed");
            return;
        }
        
        try {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");
            
            logger.info("OAuth2 authentication success: email={}, name={}", email, name);
            
            if (email == null) {
                logger.warn("OAuth2 authentication failed: No email attribute");
                response.sendRedirect("http://localhost:5173/login?error=no_email");
                return;
            }
            
            // Find or create user
            User user = userRepository.findByEmail(email).orElseGet(() -> {
                logger.info("Creating new OAuth user: email={}", email);
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setUsername(name != null ? name : email.split("@")[0]);
                newUser.setPasswordHash("OAUTH_USER"); // Mark as OAuth user
                newUser.setRole("USER");
                return userRepository.save(newUser);
            });
            
            // Generate JWT token
            String token = jwtUtils.generateJwtTokenFromEmail(email);
            logger.debug("JWT token generated for OAuth user: email={}", email);
            
            // Build redirect URL with all user data
            String redirectUrl = String.format(
                "http://localhost:5173/oauth2/redirect?token=%s&userId=%s&username=%s&email=%s&role=%s",
                URLEncoder.encode(token, StandardCharsets.UTF_8),
                URLEncoder.encode(user.getId(), StandardCharsets.UTF_8),
                URLEncoder.encode(user.getUsername(), StandardCharsets.UTF_8),
                URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8),
                URLEncoder.encode(user.getRole(), StandardCharsets.UTF_8)
            );
            
            // Redirect to frontend
            logger.info("Redirecting OAuth user to frontend: email={}", email);
            response.sendRedirect(redirectUrl);
            
        } catch (Exception e) {
            logger.error("OAuth2 authentication processing failed", e);
            response.sendRedirect("http://localhost:5173/login?error=oauth_processing_failed");
        }
    }
}

