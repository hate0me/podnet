import React, { useEffect, useState } from 'react';
import {
    List,
    ListItem,
    ListItemButton, // Добавлено
    Avatar,
    ListItemText,
    TextField,
    CircularProgress
} from '@mui/material';
import api from '../../api/api';

const ChatList = ({ onChatSelect }) => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const { data } = await api.get('/api/chats/user/me');
                setChats(data);
            } catch (err) {
                console.error('Error loading chats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchChats();
    }, []);

    if (loading) return <CircularProgress />;

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <TextField
                fullWidth
                label="Search chats"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                margin="normal"
            />
            <List>
                {filteredChats.map(chat => (
                    <ListItem key={chat.id} disablePadding>
                        <ListItemButton onClick={() => onChatSelect(chat.id)}>
                            <Avatar>{chat.name[0]}</Avatar>
                            <ListItemText
                                primary={chat.name}
                                secondary={chat.lastMessage?.content || 'No messages'}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default ChatList;