// DisplayImageSwitch.js

import React from 'react';
import { View, Image, Text, Switch } from 'react-native';

const DisplayImageSwitch = ({ imageUri, displayInFunStuff, displayInUserGallery, handleImageDisplayToggle, imageName }) => {
  return (
    <View>
      <Image source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />
      <View>
        <Text>Display in FunStuff:</Text>
        <Switch
          value={displayInFunStuff}
          onValueChange={() => handleImageDisplayToggle(imageName, 'FunStuff')}
        />
      </View>
      <View>
        <Text>Display in UserGallery:</Text>
        <Switch
          value={displayInUserGallery}
          onValueChange={() => handleImageDisplayToggle(imageName, 'UserGallery')}
        />
      </View>
    </View>
  );
};

export default DisplayImageSwitch;
