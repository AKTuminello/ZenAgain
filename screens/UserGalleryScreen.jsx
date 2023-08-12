import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, Image, StyleSheet, Text, TouchableHighlight, Modal, Dimensions, TouchableOpacity, Button } from 'react-native';
import { collection, getDocs, doc, setDoc, arrayUnion, getDoc, arrayRemove } from '@firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { AuthContext } from '../AuthContext.jsx';
import { Appbar } from 'react-native-paper';
import { globalStyles } from '../assets/globalStyles';
import { onSnapshot } from '@firebase/firestore';
import Swiper from 'react-native-swiper';

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
      if (user.profilePic_displayInUserGallery) {
        images.push({ url: user.profilePic, text: user.myprofilePic_text || '', nickname: user.nickname });
      }
      if (user.favePic1_displayInUserGallery) {
        images.push({ url: user.favePic1, text: user.myfavoriteimage_text || '', nickname: user.nickname });
      }
      if (user.favePic2_displayInUserGallery) {
        images.push({ url: user.favePic2, text: user.mysecondfavorite_text || '', nickname: user.nickname });
      }
      if (user.favePic3_displayInUserGallery) {
        images.push({ url: user.favePic3, text: user.mythirdfavorite_text || '', nickname: user.nickname });
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
    <View style={globalStyles.container}>
      <Appbar.Header>
        <Appbar.Content title="User Gallery" />
      </Appbar.Header>
      <Swiper autoplay={false} showsPagination={false} showsButtons={true}>
        {images.map((item, index) => (
          <View key={index} style={globalStyles.swiperItem}>
            <TouchableHighlight onPress={() => handleOpenModal(item)}>
              <Image source={{ uri: item.url }} style={globalStyles.imageContainer} />
            </TouchableHighlight>
            {item.nickname && <Text>{item.nickname}</Text>}
            {item.text ? <Text>{item.text}</Text> : <Text>No text provided</Text>}
            <TouchableOpacity style={globalStyles.button} onPress={() => handleLikeImage(item.url)}>
              <Text>{likes.includes(item.url) ? "Unlike" : "Like"}</Text>
            </TouchableOpacity>
            <Text style={globalStyles.text}>Likes: {likes.filter(like => like === item.url).length}</Text>
            <TouchableOpacity style={globalStyles.button} onPress={() => addFriend({ nickname: item.nickname })}>
              <Text>Add Friend</Text>
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
    </View>
  );
};

export default UserGalleryScreen;

