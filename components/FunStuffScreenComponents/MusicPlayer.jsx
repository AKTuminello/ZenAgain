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
      alert('No music file provided!'); 
      return;
    }
    setIsMusicOn(!isMusicOn);
  };

  const playAudio = async (fileUrl) => {
    try {
      await stopAudio();

      const { sound } = await Audio.Sound.createAsync({ uri: fileUrl });
      setAudio(sound);
      if (isMusicOn) {
        await sound.playAsync();
      }
    } catch (error) {
      alert('Error playing audio: ' + error.message); 
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
    <FAB
      icon={isMusicOn ? 'music' : 'music-off'}
      onPress={toggleMusic}
      accessibilityLabel={isMusicOn ? 'Pause music' : 'Play music'} 
      accessibilityRole="button"
    />
  );
};

export default MusicPlayer;
