import React from 'react';
import { Button } from 'react-native-paper';

const ProfilePicButton = ({ handleChooseImage }) => {
  return (
    <Button onPress={handleChooseImage} mode="contained" style={{ marginVertical: 10 }}>
      Choose Profile Picture
    </Button>
  );
};

export default ProfilePicButton;
