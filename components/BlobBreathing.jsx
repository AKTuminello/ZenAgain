import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Animated, Text } from 'react-native';

const BlobBreathing = () => {
  const animatedScale = useRef(new Animated.Value(1)).current;
  const animatedColor = useRef(new Animated.Value(0)).current;
  const [animation, setAnimation] = useState(null);

  const interpolateColor = animatedColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(255,0,0)', 'rgb(0,0,255)']
  });

  const startBreathing = () => {
    const breathAnimation = Animated.loop(
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
      ])
    );

    breathAnimation.start();
    setAnimation(breathAnimation);
  };

  const handleTouchStart = () => {
    startBreathing();
  };

  const handleTouchEnd = () => {
    if (animation) {
      animation.stop();
      setAnimation(null);
      animatedScale.setValue(1);
      animatedColor.setValue(0);
    }
  };

  const scale = {
    transform: [
      {
        scale: animatedScale,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.blobContainer, scale, { backgroundColor: interpolateColor }]}>
        <TouchableOpacity
          style={styles.innerContainer}
          onPressIn={handleTouchStart}
          onPressOut={handleTouchEnd}
        >
          <Text style={styles.blobPlaceholder}>Don't Panic!</Text>
        </TouchableOpacity>
      </Animated.View>
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
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  blobPlaceholder: {
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
};

export default BlobBreathing;
