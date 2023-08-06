import React from 'react';
import { Button } from 'react-native-paper';

const ProfilePicButton = ({ handleProfilePicSelection }) => {
  return (
    <Button onPress={handleProfilePicSelection} mode="contained" style={{ marginVertical: 10 }}>
      Choose Profile Picture
    </Button>
  );
};

export default ProfilePicButton;
