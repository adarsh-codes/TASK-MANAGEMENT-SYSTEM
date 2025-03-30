package com.taskmanager.project.controller;

import com.taskmanager.project.entity.User;
import com.taskmanager.project.repository.UserRepository;
import com.taskmanager.project.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "http://127.0.0.1:5500", allowedHeaders = "*")
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
    public ResponseEntity<String> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("User already exists! Please Log In!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }





    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        if(!userRepository.findByUsername(user.getUsername()).isPresent()){
            return ResponseEntity.badRequest().body("Username not found! Please Register first!");
        }


        String token = authService.login(user.getUsername(), user.getPassword(),userRepository.findEmail(user.getUsername()).orElse(null));


        return ResponseEntity.ok(token);
    }
}



