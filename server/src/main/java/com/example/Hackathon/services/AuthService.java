package com.example.Hackathon.services;

import com.example.Hackathon.dto.*;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<JwtAuthResponse> userSignup(SignupDto request);

    ResponseEntity<JwtAuthResponse> userLogin(LoginDto request);

    ResponseEntity<JwtAuthResponse> googleAuth(GoogleAuth request);

    ResponseEntity<String> saveOtp(OTPDto request);

    ResponseEntity<JwtAuthResponse> verifyOtp(OTPDto request, String username, String password);

    ResponseEntity<JwtAuthResponse> forgotPassword(OTPDto request);

    ResponseEntity<JwtAuthResponse> updatePassword(OTPDto request);
}
