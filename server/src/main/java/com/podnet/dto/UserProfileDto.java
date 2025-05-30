package com.podnet.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileDto {
    private Long id;
    private String username;
    private String email;
    private String avatarUrl;
    private boolean online;
    private String lastSeen;
    private String createdAt;
}