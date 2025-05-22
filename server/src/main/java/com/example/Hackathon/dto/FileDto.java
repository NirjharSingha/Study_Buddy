package com.example.Hackathon.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FileDto {
    private int id;
    private byte[] data;
    private String fileType;
}
