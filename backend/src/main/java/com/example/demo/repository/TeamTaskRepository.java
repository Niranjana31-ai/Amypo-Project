package com.example.demo.repository;

import com.example.demo.entity.TeamTask;
import com.example.demo.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TeamTaskRepository extends JpaRepository<TeamTask, Long> {
    List<TeamTask> findByProjectId(Long projectId);
    long countByProjectId(Long projectId);
    long countByProjectIdAndStatus(Long projectId, TaskStatus status);
}
