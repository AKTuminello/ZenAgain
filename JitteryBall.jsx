import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const JitteryBall = ({ onComplete }) => {
  const moveXAnim = useRef(new Animated.Value(0)).current;
  const moveYAnim = useRef(new Animated.Value(screenHeight / 2)).current;
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    const sequence = [];

    for (let i = 0; i < 14; i++) {
      sequence.push(
        Animated.timing(moveXAnim, {
          toValue: Math.random() * screenWidth,
          duration: 100,  // Increased speed
          easing: Easing.ease,
          useNativeDriver: true
        }),
        Animated.timing(moveYAnim, {
          toValue: Math.random() * screenHeight,
          duration: 100,  // Increased speed
          easing: Easing.ease,
          useNativeDriver: true
        })
      );
    }

    sequence.push(
      Animated.timing(moveXAnim, {
        toValue: screenWidth / 2,
        duration: 250,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(moveYAnim, {
        toValue: screenHeight / 2,
        duration: 250,
        easing: Easing.ease,
        useNativeDriver: true
      })
    );

    Animated.sequence(sequence).start(({ finished }) => {
      if (finished) {
        setAnimationFinished(true);
      }
    });
  }, []);

  useEffect(() => {
    if (animationFinished) {
      setTimeout(() => {
        onComplete();
      }, 4000);
    }
  }, [animationFinished, onComplete]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.ball,
          {
            transform: [
              { translateX: moveXAnim },
              { translateY: moveYAnim }
            ]
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray'
  },
  ball: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'darkgray',
    position: 'absolute'
  }
});

export default JitteryBall;
