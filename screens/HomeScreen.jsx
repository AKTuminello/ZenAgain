import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BlobBreathing from '../components/BlobBreathing';
import { globalStyles } from '../assets/globalStyles'; 

const HomeScreen = ({ navigation }) => {
  const handleGoToFunStuff = () => {
    navigation.navigate('FunStuff');
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Welcome to ZenAgain</Text>
      <BlobBreathing />
    </View>
  );
};

export default HomeScreen;
