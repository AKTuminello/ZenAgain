import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

const TestSwiperScreen = () => {
  return (
    <View style={styles.container}>
      <Swiper autoplay={true} showsPagination={false} showsButtons={true}>
        <View style={styles.slide}>
          <Text>Slide 1</Text>
        </View>
        <View style={styles.slide}>
          <Text>Slide 2</Text>
        </View>
        <View style={styles.slide}>
          <Text>Slide 3</Text>
        </View>
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
});

export default TestSwiperScreen;
