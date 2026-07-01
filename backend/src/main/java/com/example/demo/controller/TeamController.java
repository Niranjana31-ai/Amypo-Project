package com.example.demo.controller;

import com.example.demo.entity.SystemUser;
import com.example.demo.enums.UserRole;
import com.example.demo.repository.SystemUserRepository;
import com.example.demo.repository.TaskAssignmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/team")
public class TeamController {

    private final SystemUserRepository userRepository;
    private final TaskAssignmentRepository assignmentRepository;

    public TeamController(SystemUserRepository userRepository, TaskAssignmentRepository assignmentRepository) {
        this.userRepository = userRepository;
        this.assignmentRepository = assignmentRepository;
    }

    @GetMapping("/workload")
    public ResponseEntity<List<Map<String, Object>>> getWorkload(Authentication authentication) {
        checkCoordinator(authentication);
        List<Map<String, Object>> workload = userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.TEAM_MEMBER)
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "username", u.getUsername(),
                        "taskCount", assignmentRepository.countByUserId(u.getId()),
                        "capacity", 5
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(workload);
    }

    @GetMapping("/members")
    public ResponseEntity<List<SystemUser>> getMembers(Authentication authentication) {
        checkCoordinator(authentication);
        List<SystemUser> members = userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.TEAM_MEMBER)
                .collect(Collectors.toList());
        return ResponseEntity.ok(members);
    }

    private void checkCoordinator(Authentication authentication) {
        SystemUser user = (SystemUser) authentication.getPrincipal();
        if (user.getRole() != UserRole.PROJECT_COORDINATOR)
            throw new RuntimeException("Access denied: Only Project Coordinators can perform this action");
    }
}
