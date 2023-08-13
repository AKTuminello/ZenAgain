import React from 'react';
import { Button, Text } from 'react-native-paper';

const AuthButton = ({ onPress, title }) => {
  return (
    <Button
      onPress={onPress}
      style={{ backgroundColor: '#300040', borderRadius: 10, padding: 10, margin: 10 }}
      labelStyle={{ color: '#FFFFFF', textAlign: 'center' }}
    >
      {title}
    </Button>
  );
};

export default AuthButton;
