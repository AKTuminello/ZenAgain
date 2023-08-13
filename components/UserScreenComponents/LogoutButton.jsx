import React from 'react';
import { Button } from 'react-native-paper';
import { globalStyles } from '../../assets/globalStyles';

const LogoutButton = ({ handleLogout }) => {
  return (
    <Button
      onPress={handleLogout}
      mode="contained"
      style={{ marginVertical: 10, backgroundColor: '#300040' }} // Background color for the button
      labelStyle={{ color: '#FFFFFF' }} 
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
