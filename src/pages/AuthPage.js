import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/registration';
            const { data } = await api.post(endpoint, formData);

            // Сохраняем пользователя в контексте
            if (data.user) {
                setUser(data.user);
            }

            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            navigate('/');
        } catch (err) {
            setError(isLogin ? 'Invalid credentials' : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Box sx={{
                p: 4,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: 'background.paper'
            }}>
                <Typography variant="h4" align="center" gutterBottom>
                    {isLogin ? 'Login' : 'Register'}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            margin="normal"
                        />
                    )}

                    <TextField
                        fullWidth
                        label="Username"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        margin="normal"
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={loading}
                        sx={{ mt: 3, py: 1.5 }}
                    >
                        {loading ? <CircularProgress size={24} /> : isLogin ? 'Login' : 'Register'}
                    </Button>
                </form>

                <Button
                    fullWidth
                    color="secondary"
                    onClick={() => setIsLogin(!isLogin)}
                    sx={{ mt: 2 }}
                >
                    {isLogin ? 'No account? Register' : 'Already have an account? Login'}
                </Button>
            </Box>
        </Container>
    );
};

export default AuthPage;