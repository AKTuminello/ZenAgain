import React, { useRef, useState, useEffect } from 'react';
import { View, Animated, Text, Modal, TouchableOpacity } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

const BlobBreathing = () => {
  const { colors } = useTheme();
  const animatedScale = useRef(new Animated.Value(1)).current;
  const animatedColor = useRef(new Animated.Value(0)).current;
  const [blobText, setBlobText] = useState("Don't Panic!");
  const [modalVisible, setModalVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeouts = useRef([]);

  const interpolateColor = animatedColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(255,170,160)', 'rgb(181,210,255)']
  });

  const clearAllTimeouts = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };

  useEffect(() => {
    return () => clearAllTimeouts(); // Clear timeouts when component unmounts
  }, []);

  const startBreathing = () => {
    setIsAnimating(true);
    
    const breathingCycle = () => {
      Animated.sequence([
        Animated.timing(animatedScale, {
          toValue: 2.5,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.parallel([
          Animated.timing(animatedScale, {
            toValue: 2.5,
            duration: 7000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedColor, {
            toValue: 1,
            duration: 7000,
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(animatedScale, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedColor, {
            toValue: 0,
            duration: 8000,
            useNativeDriver: false,
          }),
        ]),
      ]).start(() => {
        if (isAnimating) {
          breathingCycle();
        }
      });
    };

    setBlobText("3");
    timeouts.current.push(setTimeout(() => setBlobText("2"), 1000));
    timeouts.current.push(setTimeout(() => setBlobText("1"), 2000));
    timeouts.current.push(setTimeout(() => {
      setBlobText("Inhale...");
      breathingCycle();
      timeouts.current.push(setTimeout(() => setBlobText("Hold..."), 4000));
      timeouts.current.push(setTimeout(() => setBlobText("Exhale..."), 11000));
    }, 3000));
  };

  const handleTouchEnd = () => {
    setIsAnimating(false);
    Animated.timing(animatedScale).stop();
    Animated.timing(animatedColor).stop();
    clearAllTimeouts();
    setBlobText("Don't Panic!");
    animatedScale.setValue(1);
    animatedColor.setValue(0);
  };

  const scale = {
    transform: [{ scale: animatedScale }],
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>4-7-8 Breathing has been shown to calm the central nervous system, decrease anxiety, and control emotional responses as well as a host of other benefits.</Text>
            <Text style={styles.modalText}>To use: Press and hold the 'press' button. Focus on the circle. Inhale as it expands. Hold the breath in as the circle remains stationary. Exhale as the circle contracts. Repeat.</Text>
            <Text style={styles.modalText}>For more, visit 'Fun Stuff'.</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Animated.View style={[styles.blobContainer, scale, { backgroundColor: interpolateColor }]}>
        <Text style={styles.blobPlaceholder}>{blobText}</Text>
      </Animated.View>
      <Button 
        mode="contained" 
        color="lightgray" 
        labelStyle={{ color: colors.text }} 
        onPressIn={startBreathing} 
        onPressOut={handleTouchEnd}
        style={{ marginTop: 50 }}
      >
        Press
      </Button>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blobContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'darkgrey',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 5,
  },
  blobPlaceholder: {
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fadadd',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#49176e',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    position: 'absolute',
    right: 10,
    top: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
};

export default BlobBreathing;
//This code works as expected, minus the repeat.