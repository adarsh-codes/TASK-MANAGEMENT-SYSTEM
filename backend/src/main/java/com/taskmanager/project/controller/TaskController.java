package com.taskmanager.project.controller;

import com.taskmanager.project.entity.Task;
import com.taskmanager.project.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.taskmanager.project.repository.TaskRepository;

import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://127.0.0.1:5500", allowedHeaders = "*")
@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;
    private final TaskRepository taskRepository;

    public TaskController(TaskService taskService,TaskRepository taskRepository) {
        this.taskService = taskService;
        this.taskRepository = taskRepository;
    }



    @GetMapping("/user")
    public ResponseEntity<List<Task>> getTasksForCurrentUser() {
        List<Task> tasks = taskService.getTasksForCurrentUser();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/user/high")
    public ResponseEntity<List<Task>> gethightasks(){
        List<Task> high = taskService.getHighPriorityTasks();
        return ResponseEntity.ok(high);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskService.getTaskById(id);
        return task.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        return ResponseEntity.ok(taskService.createTask(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task task) {
        return ResponseEntity.ok(taskService.updateTask(id, task));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<Task> updateTaskdetail(@PathVariable Long id, @RequestBody Task updatedTask) {
        Optional<Task> updated = taskService.updateTaskDetails(id, updatedTask);

        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


}
