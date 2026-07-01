package com.example.demo.service;

import com.example.demo.entity.SystemUser;
import com.example.demo.entity.TaskAssignment;
import com.example.demo.entity.TeamTask;
import com.example.demo.repository.SystemUserRepository;
import com.example.demo.repository.TaskAssignmentRepository;
import com.example.demo.repository.TeamTaskRepository;
import com.example.demo.enums.TaskStatus;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class TeamOrchestrationService {

    private final TaskAssignmentRepository assignRepo;
    private final TeamTaskRepository taskRepo;
    private final SystemUserRepository userRepo;

    public TeamOrchestrationService(TaskAssignmentRepository assignRepo,
                                     TeamTaskRepository taskRepo,
                                     SystemUserRepository userRepo) {
        this.assignRepo = assignRepo;
        this.taskRepo = taskRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public void assignTask(Long taskId, Long userId) {
        TeamTask task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        SystemUser user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (assignRepo.countByUserId(userId) >= 5)
            throw new RuntimeException("User reached maximum task capacity (5)");
        if (assignRepo.existsByTaskIdAndUserId(taskId, userId))
            throw new RuntimeException("User already assigned to this task");
        TaskAssignment assignment = new TaskAssignment();
        assignment.setTask(task);
        assignment.setUser(user);
        assignRepo.save(assignment);
        if (task.getStatus() == TaskStatus.BACKLOG) {
            task.setStatus(TaskStatus.IN_PROGRESS);
            taskRepo.save(task);
        }
    }
}
