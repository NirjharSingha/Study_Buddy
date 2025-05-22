package com.example.Hackathon.dto;

import com.example.Hackathon.enums.OtpType;
import lombok.*;

import java.sql.Timestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OTPDto {
    private int id;
    private String userEmail;
    private String otp;
    private OtpType type;
    private Timestamp timestamp;
}
