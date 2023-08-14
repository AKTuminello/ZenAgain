import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import MusicPlayer from '../components/FunStuffScreenComponents/MusicPlayer';
import BlendMenu from '../components/FunStuffScreenComponents/BlendMenu';
import { FAB, Appbar, useTheme } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import { globalStyles } from '../assets/globalStyles';
import { onSnapshot } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import leftfacing from '../assets/leftfacing.png';
import rightfacing from '../assets/rightfacing.png';


const FunStuffScreen = () => {
  const [selectedBlend, setSelectedBlend] = useState(null);
  const [blends, setBlends] = useState([]);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [funImages, setFunImages] = useState([]);
  const [swiperImages, setSwiperImages] = useState([]);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const { colors } = useTheme();
  const [error, setError] = useState(null);
  const [instructionsModalVisible, setInstructionsModalVisible] = useState(false);


  

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
      setError('There was a problem fetching the blends. Please try again later.');
    }
  };


  const fetchFunStuffImagesFromFirestore = () => {
    try {
      const usersCollectionRef = collection(db, 'users');
  
      const unsubscribe = onSnapshot(usersCollectionRef, (querySnapshot) => {
        const users = querySnapshot.docs.map(doc => doc.data());
        const images = [];
  
        users.forEach(user => { // Loop through users
          if (user.myprofilepic_displayInFunStuff) {
            images.push({
              url: user.myprofilepic,
              text: user.myprofilepic_text,
              nickname: user.nickname,
            });
          }
          if (user.myfavoriteimage_displayInFunStuff) {
            images.push({
              url: user.myfavoriteimage,
              text: user.myfavoriteimage_text,
              nickname: user.nickname,
            });
          }
          if (user.mysecondfavorite_displayInFunStuff) {
            images.push({
              url: user.mysecondfavorite,
              text: user.mysecondfavorite_text,
              nickname: user.nickname,
            });
          }
          if (user.mythirdfavorite_displayInFunStuff) {
            images.push({
              url: user.mythirdfavorite,
              text: user.mythirdfavorite_text,
              nickname: user.nickname,
            });
          }
        });
  
        setFunImages(images);
        setSwiperImages(images);
  
        return unsubscribe;
      });
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('There was a problem fetching the images. Please try again later.');
    }
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
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#bbe4ed', '#aea1d0', '#49176e']} style={globalStyles.container}>
        {error && <Text style={{ color: 'red' }}>{error}</Text>}
        <Appbar.Header style={{ backgroundColor: colors.primary }}>
          <Appbar.Content
            title="Resources"
            titleStyle={{ 
              color: colors.text, 
              ...globalStyles.appbarTitle,
            }}
          />
          <MusicPlayer fileUrl={selectedBlend?.audioUrl} isMusicOn={isMusicOn} setIsMusicOn={setIsMusicOn} />
        </Appbar.Header>
  
  
        <View style={{ height: '55%' }}>
        <Swiper 
  autoplay={false} 
  showsPagination={false} 
  showsButtons={true} 
  nextButton={<Image source={rightfacing} style={{ width: 50, height: 50 }} />}
            prevButton={<Image source={leftfacing} style={{ width: 50, height: 50}} />}
>
  {swiperImages.map((image, index) => (
    <TouchableOpacity 
      key={index} 
      accessible
      accessibilityLabel={`Image of ${image.nickname}`}
      style={{ marginTop: 40, maxWidth: '100%', maxHeight: 200, justifyContent: 'center', alignItems: 'center' }} 
      onPress={() => handleImagePress(image.url)}
    >
      <Text style={globalStyles.swiperText}>{image.nickname}</Text>
      <Image source={{ uri: image.url }} style={{ width:200, height: 200 }} accessible accessibilityLabel={`Image of ${image.nickname}`} onError={(e) => console.log('Image loading error:', e)} />
      <Text style={globalStyles.swiperText}>{image.text}</Text>
    </TouchableOpacity>
  ))}
</Swiper>
<TouchableOpacity onPress={() => setInstructionsModalVisible(true)} style={globalStyles.button}>
  <Text style={globalStyles.buttonText}>Show Instructions</Text>
</TouchableOpacity>

<BlendMenu blends={blends} handleBlendSelection={handleBlendSelection} />

<Modal
  animationType="slide"
  transparent={false}
  visible={instructionsModalVisible}
  onRequestClose={() => setInstructionsModalVisible(false)}
>
  <View style={globalStyles.centeredView}>
    <Text style={globalStyles.modalText}>Instructions for use:</Text>
    <Text style={globalStyles.instructionsText}>Instructions for use:</Text>
      <Text style={globalStyles.instructionsText}>Choose a blend from the menu.</Text>
      <Text style={globalStyles.instructionsText}>Adjust your volume--or turn the music off.</Text>
      <Text style={globalStyles.instructionsText}>Tap the picture to make it larger and use it as a focal point.</Text>
      <Text style={globalStyles.instructionsText}>Breathe deeply and enjoy!</Text>
      <Text style={globalStyles.instructionsText}>Some of our users have also shared their favorites pictures.</Text>
      <Text style={globalStyles.instructionsText}>Keep in mind that binaural beats will change your current mental state.</Text>
      <Text style={globalStyles.instructionsText}>Use only in safe situations.</Text>
    <FAB icon="close" onPress={() => setInstructionsModalVisible(false)} style={globalStyles.closeButton} />
  </View>
</Modal>
      </View>  
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
            <View style={globalStyles.centeredView}>
              <Text style={globalStyles.modalText}>{selectedBlend.name}</Text>
              <Text style={globalStyles.modalText}>{selectedBlend.oildescription}</Text>
              {selectedBlend.ingredients.map((ingredient, index) => (
                <Text key={index} style={globalStyles.modalText}>{ingredient}</Text>
              ))}
              <FAB icon="close" onPress={() => setModalVisible(false)} style={globalStyles.closeButton} />
            </View>
          )}
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};
  
export default FunStuffScreen;  