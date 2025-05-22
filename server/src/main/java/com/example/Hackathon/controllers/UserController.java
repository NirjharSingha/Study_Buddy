package com.example.Hackathon.controllers;

import com.example.Hackathon.dto.LoginDto;
import com.example.Hackathon.dto.UpdateProfileDto;
import com.example.Hackathon.models.User;
import com.example.Hackathon.services.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {
    @Autowired
    private UserServiceImpl userService;

    @PutMapping("/updateProfile")
    public ResponseEntity<String> updateUser(@RequestParam(value = "file", required = false) MultipartFile file,
                                             @ModelAttribute UpdateProfileDto updateProfileDto) {
        updateProfileDto.setProfilePic(null);
        try {
            if (file != null && !file.isEmpty()) {
                updateProfileDto.setProfilePic(file.getBytes());
            }
            if (updateProfileDto.getMobile().equals("")) {
                updateProfileDto.setMobile(null);
            }
            if (updateProfileDto.getAddress().equals("")) {
                updateProfileDto.setAddress(null);
            }
            return userService.updateUser(updateProfileDto);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to update user");
        }
    }

    @PutMapping("/updatePassword")
    public ResponseEntity<String> updatePassword(@RequestBody LoginDto loginDto) {
        return userService.updatePassword(loginDto);
    }

    @GetMapping("/getUser")
    public ResponseEntity<User> getUser(@RequestParam String userId) {
        return userService.getUser(userId);
    }
}