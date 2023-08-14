import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, Image, StyleSheet, Text, TouchableHighlight, Modal, Dimensions, TouchableOpacity, Button, SafeAreaView } from 'react-native';
import { collection, getDocs, doc, setDoc, arrayUnion, getDoc, arrayRemove } from '@firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { AuthContext } from '../AuthContext.jsx';
import { Appbar } from 'react-native-paper';
import { globalStyles } from '../assets/globalStyles';
import { onSnapshot } from '@firebase/firestore';
import Swiper from 'react-native-swiper';
import { LinearGradient } from 'expo-linear-gradient';
import leftfacing from '../assets/leftfacing.png';
import rightfacing from '../assets/rightfacing.png';

const { width } = Dimensions.get('window');

const UserGalleryScreen = () => {
  const { user } = useContext(AuthContext);
  const [images, setImages] = useState([]);
  const [likes, setLikes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserImagesFromFirestore();
      fetchFriendsFromFirestore();
      fetchLikesFromFirestore();
    }
  }, [user]);

  const fetchUserImagesFromFirestore = async () => {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = querySnapshot.docs.map(doc => doc.data());
    const images = [];
    
    console.log('Users:', users); // Log the retrieved users array
  
    users.forEach(user => {
      console.log('User:', user); // Log the current user being processed
      
      if (user.myprofilepic_displayInUserGallery) {
        images.push({ url: user.myprofilepic, text: user.myprofilepic_text || '', nickname: user.nickname });
      }
      // Similarly, add conditions for other images here
    });
  
    console.log('Images:', images); // Log the final images array
    
    setImages(images);
  };
  

  const fetchFriendsFromFirestore = async () => {
    const db = getFirestore();
    const friendsRef = doc(db, 'friends', user.uid);
    const friendsDoc = await getDoc(friendsRef);
    if (friendsDoc.exists()) {
      setFriends(friendsDoc.data().friends || []);
    }
  };

  const fetchLikesFromFirestore = async () => {
    const db = getFirestore();
    const likesRef = doc(db, 'likes', 'Rese4L1rDINgjUEMLgQ5');
    const likesDoc = await getDoc(likesRef);
    if (likesDoc.exists()) {
      setLikes(likesDoc.data().likedImages || []);
    }
  };

  const handleLikeImage = async (imageUrl) => {
    const db = getFirestore();
    const likesRef = doc(db, 'likes', 'Rese4L1rDINgjUEMLgQ5');
    if (likes.includes(imageUrl)) {
      await setDoc(likesRef, { likedImages: arrayRemove(imageUrl) }, { merge: true });
      setLikes(prev => prev.filter(like => like !== imageUrl));
    } else {
      await setDoc(likesRef, { likedImages: arrayUnion(imageUrl) }, { merge: true });
      setLikes(prev => [...prev, imageUrl]);
    }
  };

  const addFriend = async (friend) => {
    const friendExists = friends.some(f => f.nickname === friend.nickname);
    if (friendExists) {
      alert('You are already friends with this user.');
      return;
    }
    const db = getFirestore();
    const friendsRef = doc(db, 'friends', user.uid);
    await setDoc(friendsRef, { friends: arrayUnion(friend) }, { merge: true });
    setFriends([...friends, friend]);
  };

  const handleOpenModal = (image) => {
    setModalImage(image);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalImage(null);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <LinearGradient colors={['#bee4ed', '#49176e']} style={globalStyles.container}>
      <LinearGradient colors={['#bee4ed', '#acc4d9']} style={{ padding: 0 }}> 
        <Appbar.Header style={{ backgroundColor: 'transparent' }}>
          <Appbar.Content
           title="Gallery"
           titleStyle={{ 
            color: '#2E5090',
            fontSize: 30,
            ...globalStyles.appbarTitle,
          }}/>
        </Appbar.Header>
      </LinearGradient>
      <Swiper autoplay={false} showsPagination={false} showsButtons={true}
      nextButton={<Image source={rightfacing} style={{ width: 50, height: 50 }} />}
      prevButton={<Image source={leftfacing} style={{ width: 50, height: 50}} />}>
      {images.map((item, index) => (
  <View key={index} style={globalStyles.swiperItem}>
    <TouchableHighlight onPress={() => handleOpenModal(item)}>
      <Image source={{ uri: item.url }} style={globalStyles.imageContainer} />
    </TouchableHighlight>
    {item.nickname && <Text>{item.nickname}</Text>}
    {item.text ? <Text>{item.text}</Text> : <Text>No text provided</Text>}
    <TouchableOpacity style={globalStyles.button} onPress={() => handleLikeImage(item.url)}>
      <Text style={globalStyles.buttonText}>{likes.includes(item.url) ? "Unlike" : "Like"}</Text>
    </TouchableOpacity>
    <Text style={globalStyles.buttonText}>Likes: {likes.filter(like => like === item.url).length}</Text>
    <TouchableOpacity style={globalStyles.button} onPress={() => addFriend({ nickname: item.nickname })}>
      <Text style={globalStyles.buttonText}>Add Friend</Text>
    </TouchableOpacity>
  </View>
))}
</Swiper>
<Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={handleCloseModal}>
  <View style={globalStyles.centeredView}>
    <TouchableHighlight onPress={handleCloseModal} style={globalStyles.modalTouchable}>
      <Image source={{ uri: modalImage?.url }} style={globalStyles.modalImage} />
    </TouchableHighlight>
  </View>
</Modal>
</LinearGradient>
</SafeAreaView>


  );
};

export default UserGalleryScreen;

