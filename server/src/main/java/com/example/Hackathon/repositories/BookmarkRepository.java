package com.example.Hackathon.repositories;

import com.example.Hackathon.models.Bookmarks;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookmarkRepository extends JpaRepository<Bookmarks, Integer> {
    List<Bookmarks> findByUserId(String userId);

    Bookmarks findByUserIdAndResourceId(String userId, int resourceId);
}
