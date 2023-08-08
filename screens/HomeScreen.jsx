import React from 'react';
import { View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import BlobBreathing from '../components/HomeScreenComponents/BlobBreathing';
import { globalStyles } from '../assets/globalStyles';

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const handleGoToFunStuff = () => {
    navigation.navigate('FunStuff');
  };

  return (
    <View style={{...globalStyles.container, backgroundColor: colors.background }}>
      <Appbar.Header style={{ backgroundColor: colors.primary }}>
        <Appbar.Content title="Welcome to ZenAgain" titleStyle={{ color: colors.text }} />
      </Appbar.Header>
      <BlobBreathing />
    </View>
  );
};

export default HomeScreen;
