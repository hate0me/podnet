import React, { useState } from 'react';
import {
    Container,
    Box,
    IconButton,
    Typography,
    CircularProgress,
    Avatar
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatList from '../components/Chat/ChatList';
import CreateChat from '../components/Chat/CreateChat';
import MessageHistory from '../components/Chat/MessageHistory';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { user } = useAuth();

    const handleChatCreated = (newChat) => {
        setChats([...chats, newChat]);
        setSelectedChat(newChat.id);
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await api.post('/auth/logout');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/auth';
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <Container maxWidth="xl" disableGutters sx={{ height: '100vh', display: 'flex' }}>
            {/* Sidebar */}
            <Box sx={{
                width: 350,
                backgroundColor: 'background.paper',
                borderRight: '1px solid #e0e0e0',
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ mr: 2 }}>{user?.username?.[0]}</Avatar>
                    <Typography variant="h6">{user?.username}</Typography>

                    <IconButton
                        sx={{ ml: 'auto' }}
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? <CircularProgress size={24} /> : <LogoutIcon />}
                    </IconButton>
                </Box>

                <CreateChat onChatCreated={handleChatCreated} />
                <ChatList onChatSelect={setSelectedChat} />
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedChat ? (
                    <MessageHistory chatId={selectedChat} />
                ) : (
                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'background.default'
                    }}>
                        <Typography variant="h5" color="text.secondary">
                            Select a chat or create a new one
                        </Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default ChatPage;