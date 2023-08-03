import React from 'react';
import { Button } from 'react-native-paper';

const AuthButton = ({ onPress, children }) => {
  return (
    <Button onPress={onPress}>
      {children}
    </Button>
  );
};

export default AuthButton;
