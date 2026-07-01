package com.example.demo.service;

import com.example.demo.dto.ProjectRequestDto;
import com.example.demo.entity.TeamProject;
import com.example.demo.enums.ProjectStatus;
import com.example.demo.enums.TaskStatus;
import com.example.demo.repository.TeamProjectRepository;
import com.example.demo.repository.TeamTaskRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProjectOrchestrationService {

    private final TeamProjectRepository projRepo;
    private final TeamTaskRepository taskRepo;

    public ProjectOrchestrationService(TeamProjectRepository projRepo, TeamTaskRepository taskRepo) {
        this.projRepo = projRepo;
        this.taskRepo = taskRepo;
    }

    public TeamProject createProject(ProjectRequestDto dto) {
        if (dto.getStartDate() == null || dto.getEndDate() == null)
            throw new RuntimeException("Project must have a start and end date");
        if (dto.getEndDate().isBefore(dto.getStartDate()))
            throw new RuntimeException("Project end date cannot be before start date");
        TeamProject project = new TeamProject();
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        project.setStatus(ProjectStatus.PLANNING);
        return projRepo.save(project);
    }

    public TeamProject updateProject(Long id, ProjectRequestDto dto) {
        TeamProject project = projRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        if (dto.getName() != null) project.setName(dto.getName());
        if (dto.getDescription() != null) project.setDescription(dto.getDescription());
        if (dto.getStartDate() != null) project.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) project.setEndDate(dto.getEndDate());
        if (project.getEndDate() != null && project.getStartDate() != null &&
                project.getEndDate().isBefore(project.getStartDate()))
            throw new RuntimeException("Project end date cannot be before start date");
        return projRepo.save(project);
    }

    public void archiveProject(Long id) {
        TeamProject project = projRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setStatus(ProjectStatus.ARCHIVED);
        projRepo.save(project);
    }

    public List<TeamProject> getAllProjects() {
        return projRepo.findAll();
    }

    public List<TeamProject> getProjectsForUser(Long userId) {
        return projRepo.findProjectsByAssignedUser(userId);
    }

    public double calculateCompletionPercentage(Long projectId) {
        long total = taskRepo.countByProjectId(projectId);
        TeamProject project = projRepo.findById(projectId).orElse(null);
        if (total == 0) {
            if (project != null && project.getStatus() != ProjectStatus.ARCHIVED) {
                project.setStatus(ProjectStatus.PLANNING);
                projRepo.save(project);
            }
            return 0.0;
        }
        long done = taskRepo.countByProjectIdAndStatus(projectId, TaskStatus.DONE);
        double percentage = (double) done / total * 100;
        if (project != null && project.getStatus() != ProjectStatus.ARCHIVED) {
            if (percentage == 100.0)
                project.setStatus(ProjectStatus.COMPLETED);
            else
                project.setStatus(ProjectStatus.ACTIVE);
            projRepo.save(project);
        }
        return percentage;
    }

    public ProjectStatus getProjectStatus(Long projectId) {
        return projRepo.findById(projectId)
                .map(TeamProject::getStatus)
                .orElse(ProjectStatus.PLANNING);
    }
}
