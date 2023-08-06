import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import MusicPlayer from '../components/FunStuffScreenComponents/MusicPlayer';
import BlendMenu from '../components/FunStuffScreenComponents/BlendMenu';
import { FAB, Portal, Provider, Appbar } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import { globalStyles } from '../assets/globalStyles';

const FunStuffScreen = () => {
  const [selectedBlend, setSelectedBlend] = useState(null);
  const [blends, setBlends] = useState([]);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [funImages, setFunImages] = useState([]);
  const [swiperImages, setSwiperImages] = useState([]);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  useEffect(() => {
    fetchBlendsFromFirestore();
    fetchFunStuffImagesFromFirestore();
  }, []);

  const fetchBlendsFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'OilBlends'));
      const blends = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlends(blends);
    } catch (error) {
      console.error('Error fetching blends:', error);
    }
  };

  const fetchFunStuffImagesFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const users = querySnapshot.docs.map(doc => doc.data());
      const images = [];

      users.forEach(user => {
        if (user.profilePic_displayInFunStuff) {
          images.push(user.profilePic);
        }
        if (user.favePic1_displayInFunStuff) {
          images.push(user.favePic1);
        }
        if (user.favePic2_displayInFunStuff) {
          images.push(user.favePic2);
        }
        if (user.favePic3_displayInFunStuff) {
          images.push(user.favePic3);
        }
      });

      setFunImages(images);
      setSwiperImages(images); // Initial images for the swiper
    } catch (error) {
      console.error('Error fetching fun stuff images:', error);
    }
  };

  const handleBlendSelection = async (blendData) => {
    if (selectedBlend && selectedBlend.id === blendData.id) {
      return;
    }
  
    setSelectedBlend(blendData);
    setModalVisible(true);
    setSwiperImages(prevImages => [...prevImages, blendData.imageUrl]);
  };  

  
  const handleCloseImage = () => {
    setFullScreenImage(null);
  }
  const handleImagePress = (imageUrl) => {
    //this should handle issues between swiping and pressing
    setTimeout(() => {
      setFullScreenImage(imageUrl);
    }, 200);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="I want to feel more..." />
        <MusicPlayer fileUrl={selectedBlend?.audioUrl} isMusicOn={isMusicOn} setIsMusicOn={setIsMusicOn} />
      </Appbar.Header>

      <Swiper autoplay={true} showsPagination={false} showsButtons={true} style={{ backgroundColor: '#CCC4be' }}>
        {swiperImages.map((imageUrl, index) => (
          <TouchableOpacity key={index} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleImagePress(imageUrl)}>
            <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200 }} />
          </TouchableOpacity>
        ))}
      </Swiper>

      <BlendMenu blends={blends} handleBlendSelection={handleBlendSelection} />

      <Modal
        animationType="slide"
        transparent={false}
        visible={!!fullScreenImage}
        onRequestClose={handleCloseImage}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
          <Image source={{ uri: fullScreenImage }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
          <FAB icon="close" onPress={handleCloseImage} style={{ position: 'absolute', top: 50, right: 20 }} />
        </View>
      </Modal>

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
