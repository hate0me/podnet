package com.podnet.dto;

import lombok.Data;

@Data
public class RegistrationRequestDto {
    private String username;
    private String email;
    private String password;
}