package com.example.Hackathon.services.impl;

import com.example.Hackathon.dto.FileDto;
import com.example.Hackathon.dto.ResourceDto;
import com.example.Hackathon.models.Bookmarks;
import com.example.Hackathon.models.File;
import com.example.Hackathon.models.Resource;
import com.example.Hackathon.models.User;
import com.example.Hackathon.repositories.FileRepository;
import com.example.Hackathon.repositories.ResourceRepository;
import com.example.Hackathon.repositories.BookmarkRepository;
import com.example.Hackathon.repositories.UserRepository;
import com.example.Hackathon.services.ResourceService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    ResourceRepository resourceRepository;
    @Autowired
    BookmarkRepository bookmarkRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    FileRepository fileRepository;

    @Override
    public ResponseEntity<List<ResourceDto>> getBookmarks(String userId) {
        List<Bookmarks> bookmarks = bookmarkRepository.findByUserId(userId);
        List<ResourceDto> resourceDtos = new ArrayList<>();
        for (Bookmarks bookmark : bookmarks) {
            Resource resource = resourceRepository.findById(bookmark.getResource().getId()).orElse(null);
            if (resource != null) {
                List<File> files = fileRepository.findByResourceId(resource.getId());
                List<FileDto> fileDtos = new ArrayList<>();
                for (File file : files) {
                    fileDtos.add(FileDto.builder()
                            .id(file.getId())
                            .data(file.getData())
                            .fileType(resource.getType().equals("Article") ? "image" : "video/mp4")
                            .build());
                }
                ResourceDto resourceDto = ResourceDto.builder()
                        .id(resource.getId())
                        .title(resource.getTitle())
                        .content(resource.getContent())
                        .author(resource.getAuthor().getId())
                        .type(resource.getType())
                        .tag(resource.getTag())
                        .datePublished(resource.getDatePublished())
                        .files(fileDtos)
                        .isBookmarked(true)
                        .classNumber(resource.getClassNumber())
                        .build();
                resourceDtos.add(resourceDto);
            }
        }
        return ResponseEntity.ok(resourceDtos);
    }

    @Override
    @Transactional
    public ResponseEntity<String> addArticle(List<MultipartFile> documents, ResourceDto resourceDto) throws IOException {
        Optional<User> author = userRepository.findById(resourceDto.getAuthor());
        Resource resource = Resource.builder()
                .title(resourceDto.getTitle())
                .content(resourceDto.getContent())
                .author(author.orElse(null))
                .type(resourceDto.getType())
                .tag(resourceDto.getTag())
                .datePublished(new Timestamp(System.currentTimeMillis()))
                .classNumber(resourceDto.getClassNumber())
                .build();
        Resource savedResource = resourceRepository.save(resource);

        for (MultipartFile document : documents) {
            File resourceImage = File.builder()
                    .resource(savedResource)
                    .data(document.getBytes())
                    .build();
            fileRepository.save(resourceImage);
        }
        return ResponseEntity.ok("Article added successfully");
    }

    @Override
    @Transactional
    public ResponseEntity<String> editArticle(List<MultipartFile> documents, ResourceDto resourceDto) throws IOException {
        Optional<User> author = userRepository.findById(resourceDto.getAuthor());
        Resource resource = Resource.builder()
                .id(resourceDto.getId())
                .title(resourceDto.getTitle())
                .content(resourceDto.getContent())
                .author(author.orElse(null))
                .type(resourceDto.getType())
                .tag(resourceDto.getTag())
                .datePublished(new Timestamp(System.currentTimeMillis()))
                .classNumber(resourceDto.getClassNumber())
                .build();
        Resource savedResource = resourceRepository.save(resource);

        List<Integer> prevAttachments = fileRepository.getPrevFilesByResId(resourceDto.getId());
        for (Integer prevAttachment : prevAttachments) {
            if (!resourceDto.getPrevImages().contains(prevAttachment)) {
                fileRepository.deleteById(prevAttachment);
            }
        }

        for (MultipartFile document : documents) {
            File resourceImage = File.builder()
                    .resource(savedResource)
                    .data(document.getBytes())
                    .build();
            fileRepository.save(resourceImage);
        }
        return ResponseEntity.ok("Article added successfully");
    }

    @Override
    public ResponseEntity<List<ResourceDto>> getByAuthor(String authorId) {
        List<Resource> resources = resourceRepository.findByAuthorId(authorId);
        resources = resources.stream()
                .filter(r -> "Article".equalsIgnoreCase(r.getType()))
                .collect(Collectors.toList());
        List<ResourceDto> resourceDtos = new ArrayList<>();
        for (Resource resource : resources) {
            List<File> files = fileRepository.findByResourceId(resource.getId());
            List<FileDto> fileDtos = new ArrayList<>();
            for (File file: files) {
                fileDtos.add(FileDto.builder()
                        .id(file.getId())
                        .data(file.getData())
                        .fileType("image")
                        .build());
            }
            ResourceDto resourceDto = ResourceDto.builder()
                    .id(resource.getId())
                    .title(resource.getTitle())
                    .content(resource.getContent())
                    .author(resource.getAuthor().getId())
                    .type(resource.getType())
                    .tag(resource.getTag())
                    .datePublished(resource.getDatePublished())
                    .files(fileDtos)
                    .classNumber(resource.getClassNumber())
                    .build();
            resourceDtos.add(resourceDto);
        }
        return ResponseEntity.ok(resourceDtos);
    }

    @Override
    public ResponseEntity<List<ResourceDto>> getVideosByAuthor(String authorId) {
        List<Resource> resources = resourceRepository.findByAuthorId(authorId);
        resources = resources.stream()
                .filter(r -> "Video".equalsIgnoreCase(r.getType()))
                .collect(Collectors.toList());
        List<ResourceDto> resourceDtos = new ArrayList<>();
        for (Resource resource : resources) {
            List<File> files = fileRepository.findByResourceId(resource.getId());
            List<FileDto> fileDtos = new ArrayList<>();
            for (File file: files) {
                fileDtos.add(FileDto.builder()
                        .id(file.getId())
                        .data(file.getData())
                        .fileType("video/mp4")
                        .build());
            }
            ResourceDto resourceDto = ResourceDto.builder()
                    .id(resource.getId())
                    .title(resource.getTitle())
                    .content(resource.getContent())
                    .author(resource.getAuthor().getId())
                    .type(resource.getType())
                    .tag(resource.getTag())
                    .datePublished(resource.getDatePublished())
                    .files(fileDtos)
                    .classNumber(resource.getClassNumber())
                    .build();
            resourceDtos.add(resourceDto);
        }
        return ResponseEntity.ok(resourceDtos);
    }

    @Override
    public ResponseEntity<String> editVideo(List<MultipartFile> documents, ResourceDto resourceDto) {
        Optional<User> author = userRepository.findById(resourceDto.getAuthor());
        Resource resource = Resource.builder()
                .id(resourceDto.getId())
                .title(resourceDto.getTitle())
                .content(resourceDto.getContent())
                .author(author.orElse(null))
                .type(resourceDto.getType())
                .tag(resourceDto.getTag())
                .datePublished(new Timestamp(System.currentTimeMillis()))
                .classNumber(resourceDto.getClassNumber())
                .build();
        resourceRepository.save(resource);
        return ResponseEntity.ok("Video edited successfully");
    }

    @Override
    public ResponseEntity<String> toggleBookmark(String userId, int resourceId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Resource> resource = resourceRepository.findById(resourceId);

        if (user.isPresent() && resource.isPresent()) {
            Bookmarks bookmark = bookmarkRepository.findByUserIdAndResourceId(userId, resourceId);
            if (bookmark != null) {
                bookmarkRepository.delete(bookmark);
                return ResponseEntity.ok("Bookmark removed successfully");
            } else {
                Bookmarks newBookmark = Bookmarks.builder()
                        .user(user.get())
                        .resource(resource.get())
                        .build();
                bookmarkRepository.save(newBookmark);
                return ResponseEntity.ok("Bookmark added successfully");
            }
        } else {
            return ResponseEntity.badRequest().body("User or Resource not found");
        }
    }

    @Override
    public ResponseEntity<List<ResourceDto>> getAllResources() {
        List<Resource> resources = resourceRepository.findAll();
        List<ResourceDto> resourceDtos = new ArrayList<>();
        for (Resource resource : resources) {
            List<File> files = fileRepository.findByResourceId(resource.getId());
            List<FileDto> fileDtos = new ArrayList<>();
            for (File file: files) {
                fileDtos.add(FileDto.builder()
                        .id(file.getId())
                        .data(file.getData())
                        .fileType(resource.getType().equals("Article") ? "image" : "video/mp4")
                        .build());
            }
            Bookmarks bookmark = bookmarkRepository.findByUserIdAndResourceId(resource.getAuthor().getId(), resource.getId());
            ResourceDto resourceDto = ResourceDto.builder()
                    .id(resource.getId())
                    .title(resource.getTitle())
                    .content(resource.getContent())
                    .author(resource.getAuthor().getId())
                    .type(resource.getType())
                    .tag(resource.getTag())
                    .datePublished(resource.getDatePublished())
                    .files(fileDtos)
                    .classNumber(resource.getClassNumber())
                    .isBookmarked(bookmark != null) // Check if the resource is bookmarked
                    .build();
            resourceDtos.add(resourceDto);
        }
        return ResponseEntity.ok(resourceDtos);
    }
}
