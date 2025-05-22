package com.example.Hackathon.services;

import com.example.Hackathon.dto.ResourceDto;
import com.example.Hackathon.models.Bookmarks;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ResourceService {
    ResponseEntity<List<ResourceDto>> getBookmarks(String userId);

    ResponseEntity<String> addArticle(List<MultipartFile> documents, ResourceDto resourceDto) throws IOException;

    @Transactional
    ResponseEntity<String> editArticle(List<MultipartFile> documents, ResourceDto resourceDto) throws IOException;

    ResponseEntity<List<ResourceDto>> getByAuthor(String authorId);

    ResponseEntity<List<ResourceDto>> getVideosByAuthor(String userId);

    ResponseEntity<String> editVideo(List<MultipartFile> documents, ResourceDto resourceDto);

    ResponseEntity<String> toggleBookmark(String userId, int resourceId);

    ResponseEntity<List<ResourceDto>> getAllResources();
}
