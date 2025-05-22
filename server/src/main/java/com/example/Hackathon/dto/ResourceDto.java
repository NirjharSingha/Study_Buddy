package com.example.Hackathon.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.sql.Timestamp;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ResourceDto {
    private int id;
    private String title;
    private String type;
    private String content;
    private String tag;
    private List<Integer> prevImages;
    private List<FileDto> files;
    private String author;
    private Timestamp datePublished;
    @JsonProperty("isBookmarked")
    private boolean isBookmarked;
}
