package com.taskmanager.project.repository;

import com.taskmanager.project.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    @Query("Select email from User where username = :username")
    Optional<String> findEmail(String username);

    Optional<User> findByEmail(String email);

    void deleteByUsername(String username);
}
