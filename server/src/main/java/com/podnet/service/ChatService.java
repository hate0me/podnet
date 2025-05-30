package com.podnet.service;

import com.podnet.controller.ChatController;
import com.podnet.entity.Chat;
import com.podnet.entity.Message;
import com.podnet.entity.User;
import com.podnet.repository.ChatRepository;
import com.podnet.repository.UserRepository;
import com.podnet.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.podnet.dto.CreateChatRequest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public Chat createChat(CreateChatRequest request) {
        User currentUser = userService.getCurrentUser();
        Set<User> participants = new HashSet<>(userRepository.findAllById(request.getUserIds()));
        participants.add(currentUser);

        Chat chat = Chat.builder()
                .name(request.getName())
                .participants(participants)
                .createdAt(LocalDateTime.now())
                .build();

        return chatRepository.save(chat);
    }

    public List<Chat> getUserChats() {
        User currentUser = userService.getCurrentUser();
        return chatRepository.findByParticipantsId(currentUser.getId());
    }

    public List<Message> getChatMessages(Long chatId) {
        Chat chat = chatRepository.findById(chatId).orElseThrow();
        return new ArrayList<>(chat.getMessages()); // Конвертация Set в List
    }
}