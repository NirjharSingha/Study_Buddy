package com.example.Hackathon.repositories;

import com.example.Hackathon.models.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUserId(String userId);

    void deleteByUserId(String userId);

    Integer countByUserIdAndIsSeen(String userId, boolean isSeen);
}

