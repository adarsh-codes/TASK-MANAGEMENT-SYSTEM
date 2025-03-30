package com.taskmanager.project.repository;

import com.taskmanager.project.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    @Query("Select email from User where username = :username")
    Optional<String> findEmail(String username);
    void deleteByUsername(String username);
}
