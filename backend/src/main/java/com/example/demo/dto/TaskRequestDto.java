package com.example.demo.dto;

import com.example.demo.enums.TaskPriority;
import java.time.LocalDate;

public class TaskRequestDto {
    private Long projectId;
    private String title;
    private String description;
    private TaskPriority priority;
    private LocalDate dueDate;

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public TaskPriority getPriority() { return priority; }
    public void setPriority(TaskPriority priority) { this.priority = priority; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
}
