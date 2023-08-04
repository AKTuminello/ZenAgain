import React from 'react';
import { Button } from 'react-native-paper';

const FaveImageButton = ({ handleChooseImage, text }) => {
  return (
    <Button onPress={handleChooseImage} mode="contained" style={{ marginVertical: 10 }}>
      {text}
    </Button>
  );
};

export default FaveImageButton;
