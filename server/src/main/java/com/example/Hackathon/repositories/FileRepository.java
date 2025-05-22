package com.example.Hackathon.repositories;

import com.example.Hackathon.models.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FileRepository extends JpaRepository<File, Integer> {
    List<File> findByResourceId(int id);

    @Query("SELECT l.id FROM File l WHERE l.resource.id = :id")
    List<Integer> getPrevFilesByResId(int id);
    // Custom query methods can be defined here if needed
}
