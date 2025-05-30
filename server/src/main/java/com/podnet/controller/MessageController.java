package com.podnet.controller;

import com.podnet.dto.MessageDto;
import com.podnet.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{chatId}/send")
    public void handleMessage(
            @DestinationVariable Long chatId,
            MessageDto messageDto
    ) {
        MessageDto savedMessage = messageService.handleMessage(chatId, messageDto);
        messagingTemplate.convertAndSend("/topic/chat/" + chatId, savedMessage);
    }

    @PostMapping("/chats/{chatId}/messages")
    public ResponseEntity<MessageDto> sendMessage(
            @PathVariable Long chatId,
            @RequestBody String content
    ) {
        return ResponseEntity.ok(messageService.createMessage(chatId, content));
    }
}