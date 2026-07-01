package com.example.demo.repository;

import com.example.demo.entity.TeamProject;
import com.example.demo.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TeamProjectRepository extends JpaRepository<TeamProject, Long> {
    List<TeamProject> findAllByStatus(ProjectStatus status);

    @Query("SELECT DISTINCT tp FROM TeamProject tp " +
           "JOIN TeamTask tt ON tt.project = tp " +
           "JOIN TaskAssignment ta ON ta.task = tt " +
           "WHERE ta.user.id = :userId")
    List<TeamProject> findProjectsByAssignedUser(@Param("userId") Long userId);
}
