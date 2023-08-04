import React from 'react';
import { Button } from 'react-native-paper';

const LogoutButton = ({ handleLogout }) => {
  return (
    <Button onPress={handleLogout} mode="contained" style={{ marginVertical: 10 }}>
      Logout
    </Button>
  );
};

export default LogoutButton;
