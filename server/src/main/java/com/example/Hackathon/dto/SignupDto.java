package com.example.Hackathon.dto;

import com.example.Hackathon.enums.Role;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SignupDto {
    private String id;
    private String name;
    private String password;
    private Role role;
}
