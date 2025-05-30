package com.podnet.controller;

import com.podnet.dto.CreateChatRequest;
import com.podnet.entity.Chat;
import com.podnet.entity.Message;
import com.podnet.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<Chat> createChat(@RequestBody CreateChatRequest request) {
        return ResponseEntity.ok(chatService.createChat(request));
    }

    @GetMapping("/user/me")
    public ResponseEntity<List<Chat>> getCurrentUserChats() {
        return ResponseEntity.ok(chatService.getUserChats());
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<Message>> getChatMessages(@PathVariable Long chatId) {
        return ResponseEntity.ok(chatService.getChatMessages(chatId));
    }
}