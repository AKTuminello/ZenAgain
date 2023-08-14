import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import BlobBreathing from '../components/HomeScreenComponents/BlobBreathing';
import { globalStyles } from '../assets/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#bee4ed', '#49176e']} style={globalStyles.container}>
      <View style={[globalStyles.titleContainer, { paddingTop: 20 }]}> 
          <Text style={globalStyles.appbarTitle}>Catch Your Breath</Text>
        </View>
        <BlobBreathing />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default HomeScreen;
