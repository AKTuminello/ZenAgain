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
    const querySnapshot = await getDocs(collection(db, 'OilBlends'));
    const blends = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBlends(blends);
  };

  const fetchFunStuffImagesFromFirestore = async () => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = querySnapshot.docs.map(doc => doc.data());
    const images = [];
  
    users.forEach(user => {
      if (user.profilePic_displayInFunStuff) {
        images.push({ 
          url: user.profilePic, 
          text: user.profilePic_text, 
          nickname: user.nickname 
        });
      }
      if (user.favePic1_displayInFunStuff) {
        images.push({ 
          url: user.favePic1, 
          text: user.myfavoriteimage_text, 
          nickname: user.nickname 
        });
      }
      if (user.favePic2_displayInFunStuff) {
        images.push({ 
          url: user.favePic2, 
          text: user.mysecondfavorite_text, 
          nickname: user.nickname 
        });
      }
      if (user.favePic3_displayInFunStuff) {
        images.push({ 
          url: user.favePic3, 
          text: user.mythirdfavorite_text, 
          nickname: user.nickname 
        });
      }
    });
  
    setFunImages(images);
    setSwiperImages(images); 
  };

  const handleBlendSelection = async (blendData) => {
    if (selectedBlend && selectedBlend.id === blendData.id) {
      return;
    }
  
    setSelectedBlend(blendData);
    setModalVisible(true);
  
  
    setSwiperImages(prevImages => [...prevImages, {
      url: blendData.imageUrl,
      nickname: blendData.name,
      text: blendData.description
    }]);
  };
  const handleImagePress = (imageUrl) => {
    setTimeout(() => {
      setFullScreenImage(imageUrl);
    }, 200);
  };
  

  const handleCloseImage = () => {
    setFullScreenImage(null);
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="I want to feel more..." />
        <MusicPlayer fileUrl={selectedBlend?.audioUrl} isMusicOn={isMusicOn} setIsMusicOn={setIsMusicOn} />
      </Appbar.Header>

      <BlendMenu blends={blends} handleBlendSelection={handleBlendSelection} />

      <View style={{ height: '50%' }}>
  <Swiper 
    autoplay={false} 
    showsPagination={false} 
    showsButtons={true} 
    nextButton={<Text style={styles.buttonText}>Next</Text>}
    prevButton={<Text style={styles.buttonText}>Prev</Text>}
    style={{ backgroundColor: '#FFD1DC' }}
  >
    {swiperImages.map((image, index) => (
      <TouchableOpacity 
        key={index} 
        style={{ marginTop: 75, maxWidth: '100%', maxHeight: 200, justifyContent: 'center', alignItems: 'center' }} 
        onPress={() => handleImagePress(image.url)}
      >
        <Text>{image.nickname}</Text>
        <Image source={{ uri: image.url }} style={{ width:200, height: 200 }} />
        <Text>{image.text}</Text>
      </TouchableOpacity>
    ))}
  </Swiper>
</View>


      <Modal
        animationType="slide"
        transparent={false}
        visible={!!fullScreenImage}
        onRequestClose={handleCloseImage}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
          <Image source={{ uri: fullScreenImage }} style={{ width: '20%', height: '20%', resizeMode: 'contain' }} />
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
    padding: 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
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
    width: 150,
    height: 150,
    resizeMode: 'cover',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
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
