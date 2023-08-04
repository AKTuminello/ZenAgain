import React from 'react';
import { Button } from 'react-native-paper';

const AuthButton = ({ onPress, title }) => {
  return (
    <Button onPress={onPress}>
      {title}
    </Button>
  );
};

export default AuthButton;
