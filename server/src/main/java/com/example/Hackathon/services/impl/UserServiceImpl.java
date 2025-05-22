package com.example.Hackathon.services.impl;

import com.example.Hackathon.dto.GoogleAuth;
import com.example.Hackathon.dto.LoginDto;
import com.example.Hackathon.dto.SignupDto;
import com.example.Hackathon.dto.UpdateProfileDto;
import com.example.Hackathon.enums.Role;
import com.example.Hackathon.models.User;
import com.example.Hackathon.repositories.UserRepository;
import com.example.Hackathon.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;

    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) {
                return userRepository.findById(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            }
        };
    }

    @Override
    public void addUser(SignupDto signupDto) {
        if (userRepository.findById(signupDto.getId()).isPresent()) {
            throw new RuntimeException("Id already exists");
        }
        User user = new User(signupDto.getId(), signupDto.getName(), signupDto.getPassword(), signupDto.getRole(), null,
                null, new Timestamp(System.currentTimeMillis()), null, null, null);
        userRepository.save(user);
    }

    @Override
    public ResponseEntity<String> updateUser(UpdateProfileDto updateProfileDto) {
        try {
            User existingUser = userRepository.findById(updateProfileDto.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            if (existingUser != null) {
                if (updateProfileDto.getProfilePic() == null) {
                    updateProfileDto.setProfilePic(existingUser.getProfilePic());
                }
                User user = new User(updateProfileDto.getId(), updateProfileDto.getName(), existingUser.getPassword(),
                        existingUser.getRole(), updateProfileDto.getAddress(), updateProfileDto.getMobile(),
                        existingUser.getRegDate(), updateProfileDto.getGender(), updateProfileDto.getAge(), updateProfileDto.getProfilePic());
                userRepository.save(user);
                return ResponseEntity.ok("User updated successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update user");
        }
    }

    @Override
    public ResponseEntity<String> updatePassword(LoginDto loginDto) {
        User existingUser = userRepository.findById(loginDto.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (existingUser != null) {
            String hashedPassword = passwordEncoder.encode(loginDto.getPassword());
            User user = new User(existingUser.getId(), existingUser.getName(), hashedPassword, existingUser.getRole(),
                    existingUser.getAddress(), existingUser.getMobile(), existingUser.getRegDate(), existingUser.getGender(), existingUser.getAge(),
                    existingUser.getProfilePic());
            userRepository.save(user);
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public void addOAuthUser(GoogleAuth googleAuth) {
        User user = new User(googleAuth.getId(), googleAuth.getName(), null, Role.USER, null, null,
                new Timestamp(System.currentTimeMillis()), null, null, null);
        userRepository.save(user);
    }

    @Override
    public ResponseEntity<User> getUser(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
