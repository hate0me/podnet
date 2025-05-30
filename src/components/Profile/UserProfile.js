import React, { useState, useEffect } from 'react';
import {
    Avatar,
    Typography,
    Chip,
    IconButton,
    Paper,
    Box,
    CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';
import ProfileEditModal from './ProfileEditModal';

const UserProfile = ({ userId }) => {
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [lastSeen, setLastSeen] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const { data } = await api.get(`/api/users/${userId}/profile`);
                setProfile(data);
                setIsOnline(data.online);
                setLastSeen(data.lastSeen || 'Unknown');
            } catch (err) {
                console.error('Error loading profile:', err);
            }
        };

        if (userId) loadProfile();

        if (userId && userId !== 'current') {
            const ws = new WebSocket(`ws://localhost:8181/ws/status/${userId}`);
            ws.onmessage = (e) => {
                const data = JSON.parse(e.data);
                setIsOnline(data.online);
                if (!data.online) setLastSeen(new Date().toLocaleString());
            };
            return () => ws.close();
        }
    }, [userId]);

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const { data } = await api.put('/api/users/me/avatar', formData);
            setProfile(prev => ({ ...prev, avatarUrl: data }));
        } catch (err) {
            console.error('Error uploading avatar:', err);
        }
    };

    if (!profile) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', backgroundColor: 'background.paper' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label htmlFor="avatar-upload">
                    <IconButton component="span">
                        <Avatar
                            src={profile.avatarUrl}
                            sx={{
                                width: 120,
                                height: 120,
                                fontSize: 48,
                                mb: 2,
                                border: '2px solid',
                                borderColor: isOnline ? 'success.main' : 'divider'
                            }}
                        >
                            {profile.username[0]}
                        </Avatar>
                        {currentUser?.id === profile.id && (
                            <CloudUploadIcon sx={{
                                position: 'absolute',
                                bottom: 10,
                                right: 10,
                                bgcolor: 'background.paper',
                                borderRadius: '50%',
                                p: 0.5
                            }} />
                        )}
                    </IconButton>
                </label>
                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAvatarUpload}
                />

                <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    {profile.username}
                    {currentUser?.id === profile.id && (
                        <IconButton onClick={() => setIsEditing(true)} sx={{ ml: 1 }}>
                            <EditIcon />
                        </IconButton>
                    )}
                </Typography>

                <Chip
                    label={isOnline ? 'Online' : `Last seen: ${lastSeen}`}
                    color={isOnline ? 'success' : 'default'}
                    variant="outlined"
                    sx={{ mb: 3 }}
                />

                <Box sx={{ width: '100%' }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Email:</strong> {profile.email}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Joined:</strong> {profile.createdAt}
                    </Typography>
                </Box>
            </Box>

            <ProfileEditModal
                open={isEditing}
                onClose={() => setIsEditing(false)}
                profile={profile}
                onSave={setProfile}
            />
        </Paper>
    );
};

export default UserProfile;