import React from 'react';
import { Text } from 'react-native';
import { globalStyles } from '../assets/globalStyles';

const UserWelcomeText = ({ nickname }) => {
  return (
    <Text style={{ ...globalStyles.title, color: '#532915' }}>
      Welcome{nickname ? `, ${nickname}` : ''}!
    </Text>
  );
};

export default UserWelcomeText;
