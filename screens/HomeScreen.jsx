import React from 'react';
import { View } from 'react-native';
import { Appbar } from 'react-native-paper';
import BlobBreathing from '../components/BlobBreathing';
import { globalStyles } from '../assets/globalStyles'; 

const HomeScreen = ({ navigation }) => {
  const handleGoToFunStuff = () => {
    navigation.navigate('FunStuff');
  };

  return (
    <View style={globalStyles.container}>
      <Appbar.Header>
        <Appbar.Content title="Welcome to ZenAgain" />
      </Appbar.Header>
      <BlobBreathing />
    </View>
  );
};

export default HomeScreen;
