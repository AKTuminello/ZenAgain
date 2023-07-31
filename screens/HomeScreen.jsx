import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BlobBreathing from '../components/BlobBreathing';

const HomeScreen = ({ navigation }) => {
  const handleGoToFunStuff = () => {
    navigation.navigate('FunStuff');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen!</Text>

      <BlobBreathing />

      <TouchableOpacity style={styles.funStuffButton} onPress={handleGoToFunStuff}>
        <Ionicons name="happy-outline" size={24} color="white" />
        <Text style={styles.funStuffButtonText}>I'm okay right now, take me to the fun stuff</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  funStuffButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  funStuffButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default HomeScreen;
