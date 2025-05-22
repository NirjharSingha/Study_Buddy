package com.example.Hackathon.dto;

import lombok.*;

import java.sql.Timestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PasswordOTP {
    private String userEmail;
    private String otp;
    private String password;
    private Timestamp timestamp;
}
