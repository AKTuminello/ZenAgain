import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Image } from 'react-native';
import { Audio } from 'expo-av';
import { FAB } from 'react-native-paper';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { FloatingAction } from "react-native-floating-action";

const FunStuffScreen = () => {
  const [selectedBlend, setSelectedBlend] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [blendsMenu, setBlendsMenu] = useState([]);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

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
    setModalVisible(true);
  };  

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <FAB icon={isMusicOn ? "music" : "music-off"} onPress={toggleMusic} style={styles.fab} />
        <Text style={styles.header}>I want to feel more...</Text>
      </View>

      {selectedBlend && (
        <View style={styles.selectedBlendContainer}>
          <Text style={styles.selectedBlendText}>{selectedBlend.text}</Text>
          <Image source={{ uri: selectedBlend.imageUrl }} style={styles.image} />
        </View>
      )}

      <FloatingAction
        actions={blendsMenu.map((blend) => ({
          text: blend.name,
          name: blend.id.toString(),
        }))}
        onPressItem={name => {
          const blend = blendsMenu.find(blend => blend.id.toString() === name);
          handleBlendSelection(blend);
        }}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {selectedBlend && (
          <View style={styles.centeredView}>
            <Text style={styles.modalText}>{selectedBlend.name}</Text>
            <Text style={styles.modalText}>{selectedBlend.description}</Text>
            <Text style={styles.modalText}>{selectedBlend.ingredients}</Text>
            <FAB icon="close" onPress={() => setModalVisible(false)} style={styles.closeButton} />
          </View>
        )}
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  fab: {
    marginHorizontal: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  selectedBlendContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
});

export default FunStuffScreen;

