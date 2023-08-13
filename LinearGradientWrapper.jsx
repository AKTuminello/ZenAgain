import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

const LinearGradientWrapper = ({ children }) => {
  return (
    <>
    
    <LinearGradient colors={['#bee4ed', '#49176e']} style={styles.container}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LinearGradientWrapper;
