import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { FAB } from 'react-native-paper';

const MusicPlayer = ({ fileUrl, isMusicOn, setIsMusicOn }) => {
  const [audio, setAudio] = useState(null);
  
  useEffect(() => {
    if (isMusicOn) {
      if (fileUrl) {
        playAudio(fileUrl);
      } else {
        setIsMusicOn(false);
      }
    } else {
      stopAudio();
    }
  }, [fileUrl, isMusicOn]);

  const toggleMusic = async () => {
    if (!fileUrl) {
      return;
    }
    setIsMusicOn(!isMusicOn);
  };

  const playAudio = async (fileUrl) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: fileUrl });
      setAudio(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const stopAudio = async () => {
    if (audio) {
      await audio.stopAsync();
    }
  };

  return (
    <FAB icon={isMusicOn ? "music" : "music-off"} onPress={toggleMusic} />
  );
};

export default MusicPlayer;
