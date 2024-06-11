import React from 'react';
import { Button } from 'react-native';
import { auth } from '../../services/api/firebaseConfig';
import { signOut } from 'firebase/auth';

const LogoutButton = () => {
    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Optionally, perform any other cleanup or navigation logic after logout
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <Button onPress={handleLogout} title="Logout" />
    );
};

export default LogoutButton;
