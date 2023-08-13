import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View, Dimensions, Text } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const JitteryBall = ({ onComplete }) => {
  const moveXAnim = useRef(new Animated.Value(0)).current;
  const moveYAnim = useRef(new Animated.Value(screenHeight / 2)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [animationFinished, setAnimationFinished] = useState(false);
  const [text, setText] = useState('All over the place?'); 


  useEffect(() => {
    // Show second text after 2.5 seconds
    const textTimeout1 = setTimeout(() => {
      setText('Time to find your');
    }, 2500);

    // Show final text after additional 2 seconds
    const textTimeout2 = setTimeout(() => {
      setText('ZenAgain');
    }, 4500); // 2500 (first text) + 2000 (second text)

    const sequence = [];

    // Reduce the number of iterations to shave off about 4 seconds
    for (let i = 0; i < 10; i++) {
      sequence.push(
        Animated.timing(moveXAnim, {
          toValue: Math.random() * (screenWidth - 50), // Ensure it doesn't go off-screen
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true
        }),
        Animated.timing(moveYAnim, {
          toValue: Math.random() * (screenHeight - 50), // Ensure it doesn't go off-screen
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true
        })
      );
    }

    sequence.push(
      Animated.timing(moveXAnim, {
        toValue: screenWidth / 2 + 120, // Adjusted to rest at the second "n" in "ZenAgain"
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(moveYAnim, {
        toValue: screenHeight / 2 + 20, // Adjusted to rest at the same level of the second letter "n"
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 2,
        duration: 2500,
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
    }; // Clear timeouts if component unmounts
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
    color: '#bee4de',
    width: '80%', // Limit width to avoid text falling off the screen
    left: '10%',  // Center the text
  },
  ball: {
    width: 50,
    height: 50,
    position: 'absolute'
  }
});

export default JitteryBall;
