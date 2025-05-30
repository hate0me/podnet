package com.podnet.controller;

import com.podnet.dto.UpdateUserDto;
import com.podnet.dto.UserProfileDto;
import com.podnet.entity.User;
import com.podnet.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateUser(@RequestBody UpdateUserDto dto) {
        return ResponseEntity.ok(userService.updateUser(dto));
    }

    @PutMapping("/me/avatar")
    public ResponseEntity<String> updateAvatar(@RequestParam("avatar") MultipartFile file) throws IOException {
        return ResponseEntity.ok(userService.updateAvatar(file));
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<UserProfileDto> getUserProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    @GetMapping
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers().stream()
                .map(user -> new UserDto(user.getId(), user.getUsername()))
                .collect(Collectors.toList());
    }

    // DTO для безопасного возврата данных
    public record UserDto(Long id, String username) {}
}