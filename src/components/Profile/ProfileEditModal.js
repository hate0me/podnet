import React, { useState } from 'react';
import {
    Modal,
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress
} from '@mui/material';
import api from '../../api/api';

const ProfileEditModal = ({ open, onClose, profile, onSave }) => {
    const [formData, setFormData] = useState({
        username: profile.username,
        email: profile.email,
        theme: profile.theme || 'light'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.username.trim()) {
            setError('Username is required');
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.put('/api/users/me', formData);
            onSave(data);
            onClose();
        } catch (err) {
            setError('Error updating profile');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2
            }}>
                <Typography variant="h6" gutterBottom>
                    Edit Profile
                </Typography>

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    margin="normal"
                    required
                />

                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    disabled
                />

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{ mt: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
            </Box>
        </Modal>
    );
};

export default ProfileEditModal;