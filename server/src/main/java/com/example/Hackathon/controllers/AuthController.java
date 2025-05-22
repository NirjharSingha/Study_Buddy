package com.example.Hackathon.controllers;

import com.example.Hackathon.dto.*;
import com.example.Hackathon.services.impl.AuthServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    @Autowired
    private final AuthServiceImpl authenticationService;

    @PostMapping("/signup")
    public ResponseEntity<JwtAuthResponse> userSignup(@RequestBody SignupDto request) {
        return authenticationService.userSignup(request);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> userLogin(@RequestBody LoginDto request) {
        return authenticationService.userLogin(request);
    }

    @PostMapping("/googleAuth")
    public ResponseEntity<JwtAuthResponse> googleAuth(@RequestBody GoogleAuth request) {
        return authenticationService.googleAuth(request);
    }

    @PostMapping("/saveOtp")
    public ResponseEntity<String> saveOtp(@RequestBody OTPDto request) {
        return authenticationService.saveOtp(request);
    }

    @PostMapping("/verifyOtp")
    public ResponseEntity<JwtAuthResponse> verifyOtp(@RequestBody OTPDto request, @RequestParam String username, @RequestParam String password) {
        return authenticationService.verifyOtp(request, username, password);
    }

    @GetMapping("/verifyJwtToken")
    ResponseEntity<String> verifyJwtToken() {
        return ResponseEntity.ok("Token verified");
    }

    @PostMapping("/forgotPassword")
    public ResponseEntity<JwtAuthResponse> forgotPassword(@RequestBody OTPDto request) {
        return authenticationService.forgotPassword(request);
    }

    @PostMapping("/updatePassword")
    public ResponseEntity<JwtAuthResponse> updatePassword(@RequestBody OTPDto request) {
        return authenticationService.updatePassword(request);
    }
}