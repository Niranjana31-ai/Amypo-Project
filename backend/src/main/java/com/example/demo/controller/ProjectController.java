package com.example.demo.controller;

import com.example.demo.dto.ProjectRequestDto;
import com.example.demo.entity.SystemUser;
import com.example.demo.entity.TeamProject;
import com.example.demo.enums.ProjectStatus;
import com.example.demo.enums.UserRole;
import com.example.demo.service.ProjectOrchestrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectOrchestrationService projectService;

    public ProjectController(ProjectOrchestrationService projectService) {
        this.projectService = projectService;
    }

    @PreAuthorize("hasRole('PROJECT_COORDINATOR')")
    @PostMapping
    public ResponseEntity<TeamProject> createProject(@RequestBody ProjectRequestDto dto) {
        return ResponseEntity.ok(projectService.createProject(dto));
    }

    @PreAuthorize("hasRole('PROJECT_COORDINATOR')")
    @PutMapping("/{id}")
    public ResponseEntity<TeamProject> updateProject(@PathVariable Long id,
                                                      @RequestBody ProjectRequestDto dto) {
        return ResponseEntity.ok(projectService.updateProject(id, dto));
    }

    @PreAuthorize("hasRole('PROJECT_COORDINATOR')")
    @PatchMapping("/{id}/archive")
    public ResponseEntity<Void> archiveProject(@PathVariable Long id) {
        projectService.archiveProject(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<TeamProject>> getAllProjects(Authentication authentication) {
        SystemUser user = (SystemUser) authentication.getPrincipal();
        if (user.getRole() == UserRole.TEAM_MEMBER)
            return ResponseEntity.ok(projectService.getProjectsForUser(user.getId()));
        return ResponseEntity.ok(projectService.getAllProjects());
    }


    @GetMapping("/{id}/progress")
    public ResponseEntity<Map<String, Object>> getProgress(@PathVariable Long id) {
        double completion = projectService.calculateCompletionPercentage(id);
        ProjectStatus status = projectService.getProjectStatus(id);
        return ResponseEntity.ok(Map.of("completion", completion, "status", status));
    }

}
