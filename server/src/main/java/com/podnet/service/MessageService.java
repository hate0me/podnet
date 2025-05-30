package com.podnet.service;

import com.podnet.dto.MessageDto;
import com.podnet.entity.Chat;
import com.podnet.entity.Message;
import com.podnet.entity.User;
import com.podnet.repository.ChatRepository;
import com.podnet.repository.MessageRepository;
import com.podnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ChatRepository chatRepository;

    public MessageDto handleMessage(Long chatId, MessageDto messageDto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow();
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow();

        Message message = Message.builder()
                .content(messageDto.getContent())
                .timestamp(LocalDateTime.now())
                .author(user)
                .chat(chat)
                .build();

        Message savedMessage = messageRepository.save(message);
        return mapToDto(savedMessage);
    }

    public MessageDto createMessage(Long chatId, String content) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow();
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow();

        Message message = Message.builder()
                .content(content)
                .timestamp(LocalDateTime.now())
                .author(user)
                .chat(chat)
                .build();

        Message savedMessage = messageRepository.save(message);
        return mapToDto(savedMessage);
    }

    private MessageDto mapToDto(Message message) {
        return MessageDto.builder()
                .id(message.getId())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .authorId(message.getAuthor().getId())
                .chatId(message.getChat().getId())
                .build();
    }
}