import React from 'react';
import { View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import BlobBreathing from '../components/HomeScreenComponents/BlobBreathing';
import { globalStyles } from '../assets/globalStyles'; // Corrected import

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const handleGoToFunStuff = () => {
    navigation.navigate('FunStuff');
  };

  return (
    <View style={{ ...globalStyles.container, backgroundColor: colors.background }}>
      <Appbar.Header style={{ backgroundColor: colors.primary }}>
        <Appbar.Content 
          title="Catch Your Breath" 
          titleStyle={{ 
            color: colors.text, 
            ...globalStyles.appbarTitle
          }} 
        />
      </Appbar.Header>
      <BlobBreathing />
    </View>
  );
};

export default HomeScreen;
