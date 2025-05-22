package com.example.Hackathon.services.impl;

import com.example.Hackathon.dto.*;
import com.example.Hackathon.enums.OtpType;
import com.example.Hackathon.enums.Role;
import com.example.Hackathon.models.OTP;
import com.example.Hackathon.models.User;
import com.example.Hackathon.repositories.OTPRepository;
import com.example.Hackathon.repositories.UserRepository;
import com.example.Hackathon.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final OTPRepository otpRepository;
    @Autowired
    private final UserServiceImpl userService;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private final JwtServiceImpl jwtService;
    @Autowired
    private final AuthenticationManager authenticationManager;

    @Override
    public ResponseEntity<JwtAuthResponse> userSignup(SignupDto request) {
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        request.setPassword(hashedPassword);

        if (userRepository.findById(request.getId()).isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(JwtAuthResponse.builder()
                            .error("Duplicate id")
                            .build());
        }
    }

    @Override
    public ResponseEntity<JwtAuthResponse> userLogin(LoginDto request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getId(), request.getPassword()));
            var user = userRepository.findById(request.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid id or password."));
            var jwt = jwtService.generateToken(user);
            return ResponseEntity.ok(JwtAuthResponse.builder()
                    .token(jwt)
                    .role(user.getRole())
                    .build());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(JwtAuthResponse.builder()
                            .error("Invalid credentials")
                            .build());
        }
    }

    @Override
    public ResponseEntity<JwtAuthResponse> googleAuth(GoogleAuth request) {
        try {
            if (userRepository.findById(request.getId()).isEmpty()) {
                User user = User.builder()
                        .id(request.getId())
                        .name(request.getName())
                        .build();
                userService.addOAuthUser(request);
                var jwt = jwtService.generateToken(user);

                return ResponseEntity.ok(JwtAuthResponse.builder()
                        .token(jwt)
                        .role(Role.USER)
                        .build());
            } else {
                var user = userRepository.findById(request.getId())
                        .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
                var jwt = jwtService.generateToken(user);
                return ResponseEntity.ok(JwtAuthResponse.builder()
                        .token(jwt)
                        .role(user.getRole())
                        .build());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public ResponseEntity<String> saveOtp(OTPDto request) {
        request.setTimestamp(new Timestamp(System.currentTimeMillis()));
        OTP otp = OTP.builder()
                .userEmail(request.getUserEmail())
                .otp(request.getOtp())
                .type(request.getType())
                .timestamp(request.getTimestamp())
                .build();
        otpRepository.save(otp);
        return ResponseEntity.ok("OTP saved successfully");
    }

    @Override
    @Transactional
    public ResponseEntity<JwtAuthResponse> verifyOtp(OTPDto request, String username, String password) {
        System.out.println("line 1");
        List<OTP> otpList = otpRepository.findByUserEmail(request.getUserEmail());
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        for (OTP otp : otpList) {
            if (currentTime.getTime() - otp.getTimestamp().getTime() > 180000) {
                otpRepository.delete(otp);
                if (otp.getOtp().equals(request.getOtp())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(JwtAuthResponse.builder()
                                    .error("OTP expired")
                                    .build());
                }
            } else {
                System.out.println("line 2");
                if (otp.getOtp().equals(request.getOtp()) && otp.getType().equals(request.getType())) {
                    System.out.println("line 3");
                    otpRepository.deleteByUserEmail(request.getUserEmail());
                    String hashedPassword = passwordEncoder.encode(password);
                    if(request.getType().equals(OtpType.UPDATE_PASSWORD)) {
                        System.out.println("line 4");
                        Optional<User> user = userRepository.findById(request.getUserEmail());
                        if (user.isEmpty()) {
                            System.out.println("line 5");
                            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                    .body(JwtAuthResponse.builder()
                                            .error("User not found")
                                            .build());
                        } else {
                            System.out.println("line 6");
                            user.get().setPassword(hashedPassword);
                            userRepository.save(user.get());
                            System.out.println("line 7");
                            return ResponseEntity.ok(JwtAuthResponse.builder()
                                    .token(null)
                                    .role(Role.USER)
                                    .build());
                        }
                    } else if(request.getType().equals(OtpType.REGISTER)) {
                        SignupDto signupDto = SignupDto.builder()
                                .id(request.getUserEmail())
                                .name(username)
                                .password(hashedPassword)
                                .role(Role.USER)
                                .build();
                        userService.addUser(signupDto);

                        User user = User.builder()
                                .id(request.getUserEmail())
                                .password(hashedPassword)
                                .name(username)
                                .build();
                        var jwt = jwtService.generateToken(user);
                        return ResponseEntity.ok(JwtAuthResponse.builder()
                                .token(jwt)
                                .role(Role.USER)
                                .build());
                    }
                }
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(JwtAuthResponse.builder()
                        .error("Wrong OTP")
                        .build());
    }

    @Override
    public ResponseEntity<JwtAuthResponse> forgotPassword(OTPDto request) {
        System.out.println("Forgot password");
        List<OTP> otpList = otpRepository.findByUserEmail(request.getUserEmail());
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        for (OTP otp : otpList) {
            if (currentTime.getTime() - otp.getTimestamp().getTime() > 180000) {
                otpRepository.delete(otp);
                if (otp.getOtp().equals(request.getOtp())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(JwtAuthResponse.builder()
                                    .error("OTP expired")
                                    .build());
                }
            } else {
                if (otp.getOtp().equals(request.getOtp()) && otp.getType().equals(request.getType())) {
                    otpRepository.deleteByUserEmail(request.getUserEmail());

                    Optional<User> user = userRepository.findById(request.getUserEmail());
                    if (user.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(JwtAuthResponse.builder()
                                        .error("User not found")
                                        .build());
                    } else {
                        var jwt = jwtService.generateToken(user.get());
                        return ResponseEntity.ok(JwtAuthResponse.builder()
                                .token(jwt)
                                .role(Role.USER)
                                .build());
                    }
                }
            }
        }

        System.out.println("Wrong OTP");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(JwtAuthResponse.builder()
                        .error("Wrong OTP")
                        .build());
    }

    @Override
    public ResponseEntity<JwtAuthResponse> updatePassword(OTPDto request) {
        return null;
    }

}
