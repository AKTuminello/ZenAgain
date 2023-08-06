import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { FAB } from 'react-native-paper';

const MusicPlayer = ({ fileUrl, isMusicOn, setIsMusicOn }) => {
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    if (fileUrl) {
      playAudio(fileUrl);
    } else {
      stopAudio();
    }
  }, [fileUrl]);

  useEffect(() => {
    if (isMusicOn) {
      if (audio) {
        audio.playAsync();
      }
    } else {
      if (audio) {
        audio.pauseAsync();
      }
    }
  }, [isMusicOn]);

  const toggleMusic = async () => {
    if (!fileUrl) {
      return;
    }
    setIsMusicOn(!isMusicOn);
  };

  const playAudio = async (fileUrl) => {
    try {
      // Stop and unload any previously playing audio.
      await stopAudio();

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
      await audio.unloadAsync();
      setAudio(null);
    }
  };

  return (
    <FAB icon={isMusicOn ? "music" : "music-off"} onPress={toggleMusic} />
  );
};

export default MusicPlayer;
