import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View, Dimensions, Text } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const JitteryBall = ({ onComplete }) => {
  const moveXAnim = useRef(new Animated.Value(0)).current;
  const moveYAnim = useRef(new Animated.Value(screenHeight / 2)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [animationFinished, setAnimationFinished] = useState(false);
  const [text, setText] = useState('Breathe'); 

  useEffect(() => {
    const textTimeout1 = setTimeout(() => { setText("You've found"); }, 2000);
    const textTimeout2 = setTimeout(() => { setText('ZenAgain'); }, 3000); // 2000 + 2000

    const sequence = [];

    for (let i = 0; i < 10; i++) {
      sequence.push(
        Animated.timing(moveXAnim, {
          toValue: Math.random() * (screenWidth - 50),
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true
        }),
        Animated.timing(moveYAnim, {
          toValue: Math.random() * (screenHeight - 50),
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true
        })
      );
    }

    sequence.push(
      Animated.timing(moveXAnim, {
        toValue: screenWidth / 2 + 120,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(moveYAnim, {
        toValue: screenHeight / 2 + 20,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 2,
        duration: 100, // Reduced from 1000
        easing: Easing.ease,
        useNativeDriver: true
      })
    );

    Animated.sequence(sequence).start(({ finished }) => {
      if (finished) {
        setAnimationFinished(true);
      }
    });

    return () => {
      clearTimeout(textTimeout1);
      clearTimeout(textTimeout2);
    };
  }, []);

  useEffect(() => {
    if (animationFinished) {
      setTimeout(() => {
        onComplete();
      }, 500); // Reduced from 4000
    }
  }, [animationFinished, onComplete]);

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          {
            top: screenHeight / 2 + 20,
            left: screenWidth / 2 - 145,
          }
        ]}
      >
        {text}
      </Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#300040'
  },
  text: {
    fontSize: 42,
    position: 'absolute',
    textAlign: 'center',
    fontFamily: 'JosefinSans-BoldItalic',
    color: '#008080',
    width: '80%',
    left: '10%',
  },
  ball: {
    width: 50,
    height: 50,
    position: 'absolute'
  }
});

export default JitteryBall;
