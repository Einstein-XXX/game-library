package com.gamelibrary.controller;

import com.gamelibrary.model.User;
import com.gamelibrary.repository.UserRepository;
import com.gamelibrary.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/auth/oauth2")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OAuth2Controller {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @GetMapping("/success")
    public RedirectView handleOAuth2Success(@AuthenticationPrincipal OAuth2User oauth2User) {
        if (oauth2User == null) {
            return new RedirectView("http://localhost:5173/login?error=oauth_failed");
        }
        
        try {
            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");
            
            // Find or create user
            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setUsername(name != null ? name : email.split("@")[0]);
                newUser.setPasswordHash(""); // OAuth users don't need password
                newUser.setRole("USER");
                return userRepository.save(newUser);
            });
            
            // Generate JWT token
            String token = jwtUtils.generateJwtTokenFromEmail(email);
            
            // Redirect to frontend with token
            return new RedirectView("http://localhost:5173/oauth2/redirect?token=" + token + 
                    "&userId=" + user.getId() + 
                    "&username=" + user.getUsername() + 
                    "&email=" + user.getEmail() + 
                    "&role=" + user.getRole());
                    
        } catch (Exception e) {
            return new RedirectView("http://localhost:5173/login?error=oauth_processing_failed");
        }
    }
}

