import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const AuthButton = ({ onPress, title }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ backgroundColor: '#300040', borderRadius: 10, padding: 10, margin: 10, alignItems: 'center' }}>
      <Text style={{ color: '#FFFFFF' }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default AuthButton;
