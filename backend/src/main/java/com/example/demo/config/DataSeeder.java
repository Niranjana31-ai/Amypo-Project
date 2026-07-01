package com.example.demo.config;

import com.example.demo.entity.SystemUser;
import com.example.demo.enums.UserRole;
import com.example.demo.repository.SystemUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final SystemUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(SystemUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.existsByUsername("coordinator")) return;
        SystemUser coordinator = new SystemUser();
        coordinator.setUsername("coordinator");
        coordinator.setEmail("coordinator@syncup.com");
        coordinator.setPassword(passwordEncoder.encode("password"));
        coordinator.setRole(UserRole.PROJECT_COORDINATOR);
        userRepository.save(coordinator);
    }
}
