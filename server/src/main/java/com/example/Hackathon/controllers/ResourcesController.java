package com.example.Hackathon.controllers;


import com.example.Hackathon.dto.ResourceDto;
import com.example.Hackathon.models.Bookmarks;
import com.example.Hackathon.services.impl.ResourceServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/resources")
@CrossOrigin
public class ResourcesController {
    @Autowired
    private ResourceServiceImpl resourceService;

    private List<MultipartFile> processFiles(MultipartFile[] files) {
        List<MultipartFile> documents = new ArrayList<>();
        if (files != null) {
            for (MultipartFile f : files) {
                if (!f.isEmpty()) {
                    documents.add(f);
                }
            }
        }
        return documents;
    }

    @PostMapping("/addArticle")
    public ResponseEntity<String> addArticle(@RequestParam(value = "attachments", required = false) MultipartFile[] files,
                                      @ModelAttribute ResourceDto resourceDto) {
        try {
            List<MultipartFile> documents = processFiles(files);
            return resourceService.addArticle(documents, resourceDto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/editArticle")
    public ResponseEntity<String> editArticle(@RequestParam(value = "attachments", required = false) MultipartFile[] files,
                                             @ModelAttribute ResourceDto resourceDto) {
        try {
            List<MultipartFile> documents = processFiles(files);
            return resourceService.editArticle(documents, resourceDto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/getBookmarks")
    public ResponseEntity<List<ResourceDto>> getBookmarks(@RequestParam String userId) {
        return resourceService.getBookmarks(userId);
    }

    @GetMapping("/getByAuthor")
    ResponseEntity<List<ResourceDto>> getByAuthor(String userId) {
        return resourceService.getByAuthor(userId);
    }

    @GetMapping("/getVideosByAuthor")
    ResponseEntity<List<ResourceDto>> getVideosByAuthor(String userId) {
        return resourceService.getVideosByAuthor(userId);
    }

    @PutMapping("/updateVideo")
    public ResponseEntity<String> updateVideo(@RequestParam(value = "attachments", required = false) MultipartFile[] files,
                                              @ModelAttribute ResourceDto resourceDto) {
        try {
            List<MultipartFile> documents = processFiles(files);
            return resourceService.editVideo(documents, resourceDto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/toggleBookmark")
    public ResponseEntity<String> toggleBookmark(@RequestParam String userId,
                                                 @RequestParam int resourceId) {
        System.out.println("Toggle Bookmark: " + userId + ", Resource ID: " + resourceId);
        return resourceService.toggleBookmark(userId, resourceId);
    }
}
