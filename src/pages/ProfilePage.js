import React from 'react';
import UserProfile from '../components/Profile/UserProfile';
import { useAuth } from '../contexts/AuthContext';
import {Box} from "@mui/material";

const ProfilePage = () => {
    const { user } = useAuth();
    return (
        <Box sx={{ p: 3 }}>
            <UserProfile userId={user?.id || 'current'} />
        </Box>
    );
};

export default ProfilePage;