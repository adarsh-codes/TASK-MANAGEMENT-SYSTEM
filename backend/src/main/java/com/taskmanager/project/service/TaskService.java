package com.taskmanager.project.service;

import com.taskmanager.project.entity.Task;
import com.taskmanager.project.repository.TaskRepository;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import com.taskmanager.project.repository.UserRepository;
import com.taskmanager.project.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public List<Task> getTasksForCurrentUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        if (authentication == null || authentication.getPrincipal() == "anonymousUser") {
            throw new RuntimeException("User not authenticated");
        }

        String username = authentication.getName();


        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));


        return taskRepository.findByUserId(user.getId(),Sort.by(Sort.Direction.ASC, "id"));
    }


    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task createTask(Task task) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();


        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));


        task.setUser(user);


        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task updatedTask) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(updatedTask.getTitle());
            task.setDescription(updatedTask.getDescription());
            task.setStatus(updatedTask.getStatus());
            task.setPriority(updatedTask.getPriority());
            task.setDueDate(updatedTask.getDueDate());
            return taskRepository.save(task);
        }).orElseThrow(() -> new RuntimeException("Task not found"));
    }

  
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public Optional<Task> updateTaskDetails(Long id, Task updatedTask) {
        Optional<Task> optionalTask = taskRepository.findById(id);

        if (optionalTask.isEmpty()) {
            return Optional.empty();
        }

        Task existingTask = optionalTask.get();
        existingTask.setPriority(updatedTask.getPriority());
        existingTask.setStatus(updatedTask.getStatus());

        Task savedTask = taskRepository.save(existingTask);
        return Optional.of(savedTask);
    }


    public List<Task> getHighPriorityTasks(){
        return taskRepository.findByPriority();
    }
}
