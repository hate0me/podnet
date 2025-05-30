package com.podnet.dto;

import lombok.Data;

@Data
public class UpdateUserDto {
    private String username;
    private String email;
    private String theme;
}