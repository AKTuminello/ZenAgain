import React, { useRef, useState } from 'react';
import { View, Animated, Text, Modal, TouchableOpacity } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

const BlobBreathing = () => {
  const { colors } = useTheme();
  const animatedScale = useRef(new Animated.Value(1)).current;
  const animatedColor = useRef(new Animated.Value(0)).current;
  const [blobText, setBlobText] = useState("Breathe...");
  const [modalVisible, setModalVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeouts = useRef([]);
  const interval = useRef(null);

  const interpolateColor = animatedColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(255,170,160)', 'rgb(181,210,255)']
  });

  const breathingCycle = () => {
    const cycleDuration = 4000 + 7000 + 8000;
  
    Animated.loop(
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
      ]),
      {
        iterations: -1,
      }
    ).start();
  
    setBlobText("Inhale...");
  
    timeouts.current.push(setTimeout(() => {
      setBlobText("Hold...");
      timeouts.current.push(setTimeout(() => {
        setBlobText("Exhale...");
        timeouts.current.push(setTimeout(() => {
          setBlobText("Inhale...");
        }, 8000));
      }, 7000));
    }, 4000));
  
    interval.current = setInterval(() => {
      timeouts.current.push(setTimeout(() => {
        setBlobText("Hold...");
        timeouts.current.push(setTimeout(() => {
          setBlobText("Exhale...");
          timeouts.current.push(setTimeout(() => {
            setBlobText("Inhale...");
          }, 8000));
        }, 7000));
      }, 4000));
    }, cycleDuration);
  };
  
  const startBreathing = () => {
    setIsAnimating(true);
    setBlobText("Inhale...");
    breathingCycle();
  };

  const handleTouchEnd = () => {
    setIsAnimating(false);
    setBlobText("Breathe...");
    animatedScale.setValue(1);
    animatedColor.setValue(0);

    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    clearInterval(interval.current);
    interval.current = null;
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
        style={{ marginTop: 90 }}
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
    fontSize: 22,
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

