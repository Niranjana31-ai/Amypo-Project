package com.example.demo.controller;

import com.example.demo.dto.TaskRequestDto;
import com.example.demo.entity.SystemUser;
import com.example.demo.entity.TeamTask;
import com.example.demo.enums.TaskStatus;
import com.example.demo.enums.UserRole;
import com.example.demo.service.TaskExecutionService;
import com.example.demo.service.TeamOrchestrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskExecutionService taskService;
    private final TeamOrchestrationService orchestrationService;

    public TaskController(TaskExecutionService taskService, TeamOrchestrationService orchestrationService) {
        this.taskService = taskService;
        this.orchestrationService = orchestrationService;
    }

    @PostMapping
    public ResponseEntity<TeamTask> createTask(@RequestBody TaskRequestDto dto,
                                                Authentication authentication) {
        checkCoordinator(authentication);
        return ResponseEntity.ok(taskService.createTask(dto));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TeamTask>> getTasksByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(taskService.getTasksByProject(projectId));
    }

    @GetMapping
    public ResponseEntity<List<TeamTask>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<TeamTask> updateStatus(@PathVariable Long taskId,
                                                  @RequestParam TaskStatus status,
                                                  Authentication authentication) {
        SystemUser user = (SystemUser) authentication.getPrincipal();
        return ResponseEntity.ok(taskService.updateStatus(taskId, status, user));
    }

    @PostMapping("/{taskId}/assign/{userId}")
    public ResponseEntity<Void> assignTask(@PathVariable Long taskId,
                                            @PathVariable Long userId,
                                            Authentication authentication) {
        checkCoordinator(authentication);
        orchestrationService.assignTask(taskId, userId);
        return ResponseEntity.ok().build();
    }

    private void checkCoordinator(Authentication authentication) {
        SystemUser user = (SystemUser) authentication.getPrincipal();
        if (user.getRole() != UserRole.PROJECT_COORDINATOR)
            throw new RuntimeException("Access denied: Only Project Coordinators can perform this action");
    }
}
