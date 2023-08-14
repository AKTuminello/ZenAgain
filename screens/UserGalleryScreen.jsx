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
    
  
    users.forEach(user => {

      
      if (user.myprofilepic_displayInUserGallery) {
        images.push({ url: user.myprofilepic, text: user.myprofilepic_text || '', nickname: user.nickname });
      }
      if (user.myfavoriteimage_displayInUserGallery) {
        images.push({ url: user.myfavoriteimage, text: user.myfavoriteimage_text || '', nickname: user.nickname });
      }
      if (user.mysecondfavorite_displayInUserGallery) {
        images.push({ url: user.mysecondfavorite, text: user.mysecondfavorite_text || '', nickname: user.nickname });
      }
      if (user.mythirdfavorite_displayInUserGallery) {
        images.push({ url: user.mythirdfavorite, text: user.mythirdfavorite_text || '', nickname: user.nickname });
      }
      
    });
  

    
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
    try {
      const db = getFirestore();
      const likesRef = doc(db, 'likes', 'Rese4L1rDINgjUEMLgQ5');
      if (likes.includes(imageUrl)) {
        await setDoc(likesRef, { likedImages: arrayRemove(imageUrl) }, { merge: true });
        setLikes(prev => prev.filter(like => like !== imageUrl));
        console.log('Image unliked successfully:', imageUrl);
      } else {
        await setDoc(likesRef, { likedImages: arrayUnion(imageUrl) }, { merge: true });
        setLikes(prev => [...prev, imageUrl]);
        console.log('Image liked successfully:', imageUrl);
      }
    } catch (error) {
      console.error('An error occurred while liking/unliking the image:', error);
    }
  };
  // A and E

  const addFriend = async (friend) => {
    try {
      const friendExists = friends.some(f => f.nickname === friend.nickname);
      if (friendExists) {
        alert('You are already friends with this user.');
        return;
      }
      const db = getFirestore();
      const friendsRef = doc(db, 'friends', user.uid);
      await setDoc(friendsRef, { friends: arrayUnion(friend) }, { merge: true });
      setFriends([...friends, friend]);
      console.log('Friend added successfully:', friend.nickname);
    } catch (error) {
      console.error('An error occurred while adding the friend:', error);
      alert('An error occurred while adding the friend. Please try again.');
    }
  };
  // A and E
  

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
              accessible
              accessibilityLabel="Gallery Header"
              title="Gallery"
              titleStyle={{
                color: '#2E5090',
                fontSize: 30,
                ...globalStyles.appbarTitle,
              }}
            />
          </Appbar.Header>
        </LinearGradient>
        {images.length > 0 ? (
          <Swiper
            autoplay={false}
            showsPagination={false}
            showsButtons={true}
            nextButton={<Image source={rightfacing} style={{ width: 50, height: 50 }} />}
            prevButton={<Image source={leftfacing} style={{ width: 50, height: 50 }} />}
          >
            {images.map((item, index) => (
              <View key={index} accessible accessibilityLabel={`Image ${index + 1}`} style={globalStyles.swiperItem}>
                <TouchableHighlight accessible accessibilityLabel={`Open image ${index + 1}`} onPress={() => handleOpenModal(item)}>
                  <Image source={{ uri: item.url }} style={globalStyles.imageContainer} />
                </TouchableHighlight>
                {item.nickname && <Text style={globalStyles.nicknameText}>{item.nickname}</Text>}{item.text ? <Text style={globalStyles.imageText}>{item.text}</Text> : <Text style={globalStyles.imageText}>No text provided</Text>}

                <TouchableOpacity
                  accessible
                  accessibilityLabel={likes.includes(item.url) ? "Unlike this image" : "Like this image"}
                  style={globalStyles.button}
                  onPress={() => handleLikeImage(item.url)}
                >
                  <Text style={globalStyles.buttonText}>{likes.includes(item.url) ? "Unlike" : "Like"}</Text>
                </TouchableOpacity>
                <Text style={globalStyles.buttonText}>Likes: {likes.filter((like) => like === item.url).length}</Text>
                <TouchableOpacity
                  accessible
                  accessibilityLabel="Add Friend"
                  style={globalStyles.button}
                  onPress={() => addFriend({ nickname: item.nickname })}
                >
                  <Text style={globalStyles.buttonText}>Add Friend</Text>
                </TouchableOpacity>
              </View>
            ))}
          </Swiper>
        ) : (
          <View accessible accessibilityLabel="No images available">
            <Text>No images available</Text>
          </View>
        )}
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={handleCloseModal}>
          <View style={globalStyles.centeredView}>
            <TouchableHighlight accessible accessibilityLabel="Close image preview" onPress={handleCloseModal} style={globalStyles.modalTouchable}>
              <Image source={{ uri: modalImage?.url }} style={globalStyles.modalImage} />
            </TouchableHighlight>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};
export default UserGalleryScreen;  

  
  
