package com.example.Hackathon.services;

import com.example.Hackathon.dto.*;
import com.example.Hackathon.models.User;
import org.springframework.http.ResponseEntity;

public interface UserService {
    void addUser(SignupDto user);

    ResponseEntity<String> updateUser(UpdateProfileDto updateProfileDto);

    ResponseEntity<String> updatePassword(LoginDto loginDto);

    void addOAuthUser(GoogleAuth user);

    ResponseEntity<User> getUser(String userId);

}
