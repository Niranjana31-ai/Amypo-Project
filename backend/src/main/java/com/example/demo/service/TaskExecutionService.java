package com.example.demo.service;

import com.example.demo.dto.TaskRequestDto;
import com.example.demo.entity.SystemUser;
import com.example.demo.entity.TeamProject;
import com.example.demo.entity.TeamTask;
import com.example.demo.enums.ProjectStatus;
import com.example.demo.enums.TaskStatus;
import com.example.demo.enums.UserRole;
import com.example.demo.repository.TeamProjectRepository;
import com.example.demo.repository.TeamTaskRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskExecutionService {

    private final TeamTaskRepository taskRepo;
    private final TeamProjectRepository projRepo;

    public TaskExecutionService(TeamTaskRepository taskRepo, TeamProjectRepository projRepo) {
        this.taskRepo = taskRepo;
        this.projRepo = projRepo;
    }

    public TeamTask createTask(TaskRequestDto dto) {
        TeamProject project = projRepo.findById(dto.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        if (project.getStatus() == ProjectStatus.ARCHIVED)
            throw new RuntimeException("Cannot add tasks to an archived project");
        if (dto.getDueDate() != null && project.getStartDate() != null &&
                dto.getDueDate().isBefore(project.getStartDate()))
            throw new RuntimeException("Invalid start date for task: Due date cannot be earlier than project start date (" + project.getStartDate() + ")");
        TeamTask task = new TeamTask();
        task.setProject(project);
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setPriority(dto.getPriority());
        task.setDueDate(dto.getDueDate());
        task.setStatus(TaskStatus.BACKLOG);
        return taskRepo.save(task);
    }

    public List<TeamTask> getTasksByProject(Long projectId) {
        return taskRepo.findByProjectId(projectId);
    }

    public List<TeamTask> getAllTasks() {
        return taskRepo.findAll();
    }

    public TeamTask updateStatus(Long taskId, TaskStatus newStatus, SystemUser user) {
        if (user.getRole() == UserRole.STAKEHOLDER)
            throw new RuntimeException("Stakeholders have read-only access and cannot modify task statuses");
        TeamTask task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (newStatus == TaskStatus.BACKLOG && user.getRole() != UserRole.PROJECT_COORDINATOR)
            throw new RuntimeException("Only Project Coordinators can revert tasks to Backlog");
        if (user.getRole() == UserRole.TEAM_MEMBER) {
            if (newStatus == TaskStatus.DONE && task.getStatus() != TaskStatus.TESTING)
                throw new RuntimeException("Invalid status transition");
            if (newStatus == TaskStatus.TESTING && task.getStatus() != TaskStatus.IN_PROGRESS)
                throw new RuntimeException("Invalid status transition");
        }
        task.setStatus(newStatus);
        return taskRepo.save(task);
    }
}
