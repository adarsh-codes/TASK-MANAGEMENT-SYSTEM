package com.taskmanager.project.controller;

import com.taskmanager.project.dto.UserProfileUpdateDTO;
import com.taskmanager.project.dto.LoginRequestDTO;
import com.taskmanager.project.dto.SignUpRequestDTO;
import com.taskmanager.project.entity.User;
import com.taskmanager.project.repository.UserRepository;
import com.taskmanager.project.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = {"http://127.0.0.1:5500","http://localhost:5500"}, allowedHeaders = "*")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthService authService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody SignUpRequestDTO user) {
        try {
            String response = authService.register(user);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDTO user) {
        if(!userRepository.findByUsername(user.getUsername()).isPresent()){
            return ResponseEntity.badRequest().body("Username not found! Please Register first!");
        }
        String token = authService.login(user.getUsername(), user.getPassword(),userRepository.findEmail(user.getUsername()).orElse(null));
        return ResponseEntity.ok(token);
    }

    @PutMapping("/change")
    public ResponseEntity<String> change(@RequestBody UserProfileUpdateDTO userDto) {
        try {
            String response = authService.updateUserProfile(userDto);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        
    }
}



