import React, { useEffect, useState, useRef } from 'react';
import {
    Paper,
    List,
    ListItem,
    TextField,
    IconButton,
    Typography,
    Box
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Client } from '@stomp/stompjs';
import api from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';

const MessageHistory = ({ chatId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { user } = useAuth();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!chatId) return;

        const fetchMessages = async () => {
            try {
                const { data } = await api.get(`/api/chats/${chatId}/messages`);
                setMessages(data);
            } catch (err) {
                console.error('Error loading messages:', err);
            }
        };
        fetchMessages();

        const stompClient = new Client({
            brokerURL: 'ws://localhost:8181/ws',
            reconnectDelay: 5000,
            onConnect: () => {
                stompClient.subscribe(`/topic/chat/${chatId}`, (message) => {
                    const newMsg = JSON.parse(message.body);
                    setMessages(prev => [...prev, newMsg]);
                });
            }
        });
        stompClient.activate();

        return () => stompClient.deactivate();
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            await api.post(`/api/chats/${chatId}/messages`, {
                content: newMessage
            });
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    return (
        <Paper elevation={3} sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                <List>
                    {messages.map(message => (
                        <ListItem
                            key={message.id}
                            sx={{
                                justifyContent: message.author.id === user.id ? 'flex-end' : 'flex-start',
                                alignItems: 'flex-start'
                            }}
                        >
                            <Box sx={{
                                backgroundColor: message.author.id === user.id ? '#1976d2' : '#e0e0e0',
                                color: message.author.id === user.id ? 'white' : 'black',
                                p: 1.5,
                                borderRadius: 2,
                                maxWidth: '70%'
                            }}>
                                <Typography>{message.content}</Typography>
                                <Typography variant="caption" sx={{
                                    display: 'block',
                                    textAlign: 'right',
                                    color: message.author.id === user.id ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'
                                }}>
                                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            </Box>
                        </ListItem>
                    ))}
                    <div ref={messagesEndRef} />
                </List>
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', display: 'flex', alignItems: 'center' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <IconButton color="primary" onClick={handleSendMessage}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Paper>
    );
};

export default MessageHistory;