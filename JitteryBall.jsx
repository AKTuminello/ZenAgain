import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View, Dimensions, Text } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const JitteryBall = ({ onComplete }) => {
  const moveXAnim = useRef(new Animated.Value(0)).current;
  const moveYAnim = useRef(new Animated.Value(screenHeight / 2)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    const sequence = [];

    for (let i = 0; i < 14; i++) {
      sequence.push(
        Animated.timing(moveXAnim, {
          toValue: Math.random() * screenWidth,
          duration: 100,
          easing: Easing.ease,
          useNativeDriver: true
        }),
        Animated.timing(moveYAnim, {
          toValue: Math.random() * screenHeight,
          duration: 100,
          easing: Easing.ease,
          useNativeDriver: true
        })
      );
    }

    sequence.push(
      Animated.timing(moveXAnim, {
        toValue: screenWidth / 2 - 25,
        duration: 250,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(moveYAnim, {
        toValue: screenHeight / 2 - 25,
        duration: 250,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 2,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1000,
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
      <Animated.Image
        style={[
          styles.ball,
          {
            transform: [
              { translateX: moveXAnim },
              { translateY: moveYAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
        source={require('./assets/images/cutes.png')}
      />
      <Animated.Text
        style={[
          styles.text,
          {
            opacity: opacityAnim,
            top: screenHeight / 2 + 20,
            left: screenWidth / 2 - 145,
          }
        ]}
      >
        ZenAgain
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink'
  },
  ball: {
    width: 50,
    height: 50,
    position: 'absolute'
  },
  text: {
    fontSize: 42,
    position: 'absolute',
    textAlign: 'center',
    fontFamily: 'JosefinSans-BoldItalic',
    color: '#e30b5d',
  }
});

export default JitteryBall;
