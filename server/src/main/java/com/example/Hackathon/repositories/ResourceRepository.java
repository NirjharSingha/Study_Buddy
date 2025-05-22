package com.example.Hackathon.repositories;

import com.example.Hackathon.models.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Integer> {
    List<Resource> findByAuthorId(String authorId);
}
