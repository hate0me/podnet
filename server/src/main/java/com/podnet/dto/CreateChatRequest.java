package com.podnet.dto;

import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class CreateChatRequest {
    private String name;
    private List<Long> userIds;
}