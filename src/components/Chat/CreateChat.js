import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Autocomplete,
    CircularProgress,
    Avatar,
    Alert // Добавлено
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '../../api/api';

const CreateChat = ({ onChatCreated }) => {
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [chatName, setChatName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Добавлено

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setError(null);
                const { data } = await api.get('/api/users');
                setUsers(data);
            } catch (err) {
                console.error('Error loading users:', err);
                setError('Failed to load users. Please try again.');
            }
        };

        if (open) fetchUsers();
    }, [open]);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post('/api/chats', {
                name: chatName,
                userIds: selectedUsers.map(u => u.id)
            });

            onChatCreated(response.data);
            setOpen(false);
            setChatName('');
            setSelectedUsers([]);
        } catch (err) {
            console.error('Error creating chat:', err);
            setError('Failed to create chat. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpen(true)}
                fullWidth
                sx={{ mb: 2 }}
            >
                New Chat
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Create New Chat</DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        label="Chat Name"
                        fullWidth
                        margin="normal"
                        value={chatName}
                        onChange={(e) => setChatName(e.target.value)}
                        required
                    />
                    <Autocomplete
                        multiple
                        options={users}
                        getOptionLabel={(user) => user.username}
                        value={selectedUsers}
                        onChange={(_, value) => setSelectedUsers(value)}
                        renderOption={(props, user) => (
                            <li {...props}>
                                <Avatar sx={{ width: 24, height: 24, mr: 1 }}>{user.username[0]}</Avatar>
                                {user.username}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Participants"
                                margin="normal"
                                required
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !chatName || selectedUsers.length === 0}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CreateChat;