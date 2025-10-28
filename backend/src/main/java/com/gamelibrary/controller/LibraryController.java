package com.gamelibrary.controller;

import com.gamelibrary.dto.MessageResponse;
import com.gamelibrary.model.GameLibrary;
import com.gamelibrary.security.UserDetailsImpl;
import com.gamelibrary.service.LibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/library")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LibraryController {
    
    @Autowired
    private LibraryService libraryService;
    
    @GetMapping("/my-games")
    public ResponseEntity<List<GameLibrary>> getMyLibrary(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(libraryService.getUserLibrary(userDetails.getId()));
    }
    
    @PostMapping("/add/{gameId}")
    public ResponseEntity<?> addToLibrary(@PathVariable Long gameId, Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            GameLibrary library = libraryService.addToLibrary(userDetails.getId(), gameId);
            return ResponseEntity.ok(library);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/check/{gameId}")
    public ResponseEntity<Boolean> isInLibrary(@PathVariable Long gameId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(libraryService.isInLibrary(userDetails.getId(), gameId));
    }
}

