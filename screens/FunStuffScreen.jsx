import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Audio } from 'expo-av';
import { FAB, Portal } from 'react-native-paper';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';



const FunStuffScreen = () => {
  const [selectedBlend, setSelectedBlend] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [blendsMenu, setBlendsMenu] = useState([]);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);

  useEffect(() => {
    fetchBlendsFromFirestore();
  }, []);

  const fetchBlendsFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'OilBlends'));
      const blends = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlendsMenu(blends);
    } catch (error) {
      console.error('Error fetching blends:', error);
    }
  };

  const toggleMusic = async () => {
    if (isMusicOn) {
      await stopAudio();
    } else {
      if (selectedBlend?.audioUrl) {
        await playAudio(selectedBlend.audioUrl);
      }
    }
    setIsMusicOn(!isMusicOn);
  };

  const playAudio = async (fileUrl) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: fileUrl });
      setAudio(sound);
      await sound.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const stopAudio = async () => {
    if (audio) {
      await audio.stopAsync();
      setIsPlaying(false);
    }
  };

  const handleBlendSelection = async (blendData) => {
    if (selectedBlend && selectedBlend.id === blendData.id) {
      return;
    }
  
    await stopAudio();
    if (blendData.audioUrl && isMusicOn) {
      await playAudio(blendData.audioUrl);
    }
    setSelectedBlend(blendData);
  };  

  return (
    <View style={styles.container}>
      {selectedBlend && (
        <View style={styles.selectedBlendContainer}>
          <Text style={styles.selectedBlendText}>{selectedBlend.text}</Text>
          <Image source={{ uri: selectedBlend.imageUrl }} style={styles.image} />
        </View>
      )}
  
      <View style={styles.bottomBar}>
        <FAB icon={isMusicOn ? "music" : "music-off"} onPress={toggleMusic} style={styles.fab} />
        <Text style={styles.header}>I want to feel more...</Text>
      </View>
  
      <Portal>
        <FAB.Group
          open={isFabOpen}
          icon={isFabOpen ? 'close' : 'plus'}
          actions={blendsMenu.map((blend) => ({
            icon: 'playlist-play', // replace with an icon
            label: blend.name,
            onPress: () => handleBlendSelection(blend),
          }))}
          onStateChange={({ open }) => setIsFabOpen(open)}
          onPress={() => {
            if (isFabOpen) {
              // do something if the FAB is open
            }
          }}
        />
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    paddingBottom: 10,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    marginHorizontal: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  selectedBlendContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  selectedBlendText: {
    fontSize: 18,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
});

export default FunStuffScreen;
